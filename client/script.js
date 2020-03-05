var stripe, customer, setupIntent;
var signupForm = document.getElementById('signup-form');
var paymentForm = document.getElementById('payment-form');

var stripeElements = function(publicKey) {
  stripe = Stripe(publicKey, { betas: ['au_bank_account_beta_2'] });
  var elements = stripe.elements();

  // Card Element styles
  var style = {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: 'rgba(0,0,0,0.4)'
      }
    }
  };

  var card = elements.create('card', { style: style });

  card.mount('#card-element');

  // AU BECS Debit Element
  var auBankAccount = elements.create('auBankAccount', {
    style: style
  });

  // Add an instance of the auBankAccount Element into the `auBankAccount-element` <div>.
  auBankAccount.mount('#auBankAccount-element');

  for (element of [card, auBankAccount]) {
    // Element focus ring
    element.on('focus', function() {
      var el = document.getElementById(`${element._componentName}-element`);
      el.classList.add('focused');
    });

    element.on('blur', function() {
      var el = document.getElementById(`${element._componentName}-element`);
      el.classList.remove('focused');
    });

    element.on('change', function(event) {
      var displayError = document.getElementById('error-message');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }

  signupForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    document.getElementById('signup-view').classList.add('hidden');
    document.getElementById('payment-view').classList.remove('hidden');

    // Create customer
    createCustomer().then(result => {
      customer = result.customer;
      setupIntent = result.setupIntent;
      paymentForm.addEventListener('submit', function(evt) {
        evt.preventDefault();
        changeLoadingState(true);
        // Initiate payment
        var payment = paymentForm.querySelector('input[name=payment]:checked')
          .value;
        setupPaymentMethod(setupIntent.client_secret, payment, {
          card: card,
          au_becs_debit: auBankAccount
        });
      });
    });
  });
};

function showCardError(error) {
  changeLoadingState(false);
  // The card was declined (i.e. insufficient funds, card has expired, etc)
  var errorMsg = document.querySelector('.sr-field-error');
  errorMsg.textContent = error.message;
  setTimeout(function() {
    errorMsg.textContent = '';
  }, 8000);
}

var setupPaymentMethod = function(setupIntentSecret, paymentMethod, element) {
  var billingName = document.querySelector('#name').value;
  var billingEmail = document.querySelector('#email').value;

  switch (paymentMethod) {
    case 'card':
      stripe
        .confirmCardSetup(setupIntentSecret, {
          payment_method: {
            card: element[paymentMethod],
            billing_details: {
              name: billingName,
              email: billingEmail
            }
          }
        })
        .then(handleResult);
      break;
    case 'au_becs_debit':
      stripe
        .confirmAuBecsDebitSetup(setupIntentSecret, {
          payment_method: {
            au_becs_debit: element[paymentMethod],
            billing_details: {
              name: billingName,
              email: billingEmail
            }
          }
        })
        .then(handleResult);
      break;
    default:
      console.warn('Unhandled Payment Method!');
      break;
  }

  function handleResult(result) {
    if (result.error) {
      showCardError(result.error);
    } else {
      // Create the subscription
      createSubscription(customer.id, result.setupIntent.payment_method);
    }
  }
};

async function createCustomer() {
  var billingName = document.querySelector('#name').value;
  var billingEmail = document.querySelector('#email').value;

  return fetch('/create-customer', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: billingName,
      email: billingEmail
    })
  })
    .then(response => {
      return response.json();
    })
    .then(result => {
      return result;
    });
}

function createSubscription(customerId, paymentMethodId) {
  return fetch('/subscription', {
    method: 'post',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      customerId: customerId,
      paymentMethodId: paymentMethodId
    })
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(subscription) {
      orderComplete(subscription);
    });
}

function getPublicKey() {
  return fetch('/public-key', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      stripeElements(response.publicKey);
    });
}

getPublicKey();

/* ------- Post-payment helpers ------- */

/* Shows a success / error message when the payment is complete */
var orderComplete = function(subscription) {
  changeLoadingState(false);
  var subscriptionJson = JSON.stringify(subscription, null, 2);
  document.querySelectorAll('.sr-form').forEach(function(view) {
    view.classList.add('hidden');
  });
  document.querySelectorAll('.completed-view').forEach(function(view) {
    view.classList.remove('hidden');
  });
  document.querySelector('.order-status').textContent = subscription.status;
  document.querySelector('code').textContent = subscriptionJson;
};

// Show a spinner on subscription submission
var changeLoadingState = function(isLoading) {
  if (isLoading) {
    document.querySelector('#payment-form button').disabled = true;
    document.querySelector('#spinner').classList.add('loading');
    document.querySelector('#button-text').classList.add('hidden');
  } else {
    document.querySelector('#payment-form button').disabled = false;
    document.querySelector('#spinner').classList.remove('loading');
    document.querySelector('#button-text').classList.remove('hidden');
  }
};

var showPaymentMethods = function() {
  // Listen to changes to the payment method selector.
  for (let input of document.querySelectorAll('input[name=payment]')) {
    input.addEventListener('change', event => {
      event.preventDefault();
      var payment = paymentForm.querySelector('input[name=payment]:checked')
        .value;

      // Show the relevant details, whether it's an extra element or extra information for the user.
      paymentForm
        .querySelector('.payment-info.card')
        .classList.toggle('visible', payment === 'card');
      paymentForm
        .querySelector('.payment-info.au_becs_debit')
        .classList.toggle('visible', payment === 'au_becs_debit');
    });
  }
};
showPaymentMethods();
