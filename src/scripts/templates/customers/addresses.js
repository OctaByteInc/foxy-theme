/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

import {AddressForm} from '@shopify/theme-addresses';


const selectors = {
  addressContainer: '[data-address]',
  addressFields: '[data-address-fields]',
  addressToggle: '[data-address-toggle]',
  addressForm: '[data-address-form]',
  addressDeleteForm: '[data-address-delete-form]',
  addressHeading: '[data-address-heading-element]',
  addNewAddress : '[data-s-add-new-address]',
  editAddress: '[data-s-edit-address]',
  cancelAddress: '[data-s-cancel-address]',
  cancelNewAddress: '[data-s-cancel-new-address]',
  customerAdrs: '[data-s-customer-address]'
};
const hideClass = 'd-none';

function initializeAddressForm(container) {
  const addressFields = container.querySelector(selectors.addressFields);
  const deleteForm = container.querySelector(selectors.addressDeleteForm);


  AddressForm(addressFields, 'en');

  /* if (deleteForm) {
    deleteForm.addEventListener('submit', (event) => {
      const confirmMessage = deleteForm.getAttribute('data-confirm-message');

      if (!window.confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
        event.preventDefault();
      }
    });
  } */
}

const addressForms = document.querySelectorAll(selectors.addressContainer);
if (addressForms.length) {
  addressForms.forEach((addressContainer) => {
    initializeAddressForm(addressContainer);
  });
}

const addNewAdrs = document.querySelector(selectors.addNewAddress);
addNewAdrs.addEventListener('click', function(){
  addNewAddress();
});

const cancelNewAdrs = document.querySelector(selectors.cancelNewAddress);
cancelNewAdrs.addEventListener('click', (event) => {
  cancelNewAddress(event);
});

const editAdrs = document.querySelectorAll(selectors.editAddress);
if(editAdrs.length) {
  editAdrs.forEach((addr) => {
    const id = addr.dataset.addressId;
    addr.addEventListener('click', () => {
      editAddress(id);
    });
  });
}

const cancelAdrs = document.querySelectorAll(selectors.cancelAddress);
if(cancelAdrs.length) {
  cancelAdrs.forEach((addr) => {
    const id = addr.dataset.addressId;
    addr.addEventListener('click', (event) => {
      cancelEditAddress(event, id);
    });
  });
}

function editAddress(addressId) {
  var addressHeading = document.getElementById('address-heading');
  addressHeading.innerText = "EDIT ADDRESS";

  var coustomerAdrss = document.querySelectorAll(selectors.customerAdrs);
  if(coustomerAdrss != null) {
    coustomerAdrss.forEach((adr) => {
      adr.style.display = "none";
    });
  }

  var editAddress = document.getElementById("edit-address-" + addressId);
  editAddress.style.display = "block";

  var addNewAddress = document.getElementById("add-new-address");
  addNewAddress.style.display = "none";
}

function cancelEditAddress(event, addressId) {
  event.preventDefault();

  var addressHeading = document.getElementById('address-heading');
  addressHeading.innerText = "YOUR ADDRESSES";

  var coustomerAdrss = document.querySelectorAll(selectors.customerAdrs);
  if (coustomerAdrss != null) {
    coustomerAdrss.forEach((adr) => {
      adr.style.display = "block";
    });
  }

  var editAddress = document.getElementById("edit-address-" + addressId);
  editAddress.style.display = "none";

  var addNewAddress = document.getElementById("add-new-address");
  addNewAddress.style.display = "none";
}

function addNewAddress() {

  var addressHeading = document.getElementById('address-heading');
  addressHeading.innerText = "NEW ADDRESS";

  var coustomerAdrss = document.querySelectorAll(selectors.customerAdrs);
  if (coustomerAdrss != null) {
    coustomerAdrss.forEach((adr) => {
      adr.style.display = "none";
    });
  }

  var addNewAddress = document.getElementById("add-new-address");
  addNewAddress.style.display = "block";
}

function cancelNewAddress(event) {
  event.preventDefault();

  var addressHeading = document.getElementById('address-heading');
  addressHeading.innerText = "YOUR ADDRESSES";

  var coustomerAdrss = document.querySelectorAll(selectors.customerAdrs);
  if(coustomerAdrss != null) {
    coustomerAdrss.forEach((adr) => {
      adr.style.display = "block";
    });
  }

  var addNewAddress = document.getElementById("add-new-address");
  addNewAddress.style.display = "none";
}