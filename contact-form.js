/**
 * Contact Form Handler for CameraInspect Website
 *
 * This script manages the form submission process,
 * form validation, and provides user feedback.
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        // Initialize form validation and submission
        initContactForm(contactForm);
    }
});

/**
 * Initialize the contact form functionality
 * @param {HTMLFormElement} form - The contact form element
 */
function initContactForm(form) {
    // Form validation configuration
    const validationConfig = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 100,
            errorMessage: 'Please enter your name (2-100 characters)'
        },
        email: {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            errorMessage: 'Please enter a valid email address'
        },
        phone: {
            required: false,
            pattern: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
            errorMessage: 'Please enter a valid phone number or leave empty'
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 2000,
            errorMessage: 'Please enter your message (10-2000 characters)'
        }
    };

    // Add form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Remove any existing error messages
        clearErrors(form);

        // Validate form
        if (validateForm(form, validationConfig)) {
            // Show loading indicator
            showLoadingState(form);

            // Submit the form data
            submitFormData(form)
                .then(response => {
                    // Hide loading indicator
                    hideLoadingState(form);

                    // Handle the response
                    if (response.success) {
                        showSuccessMessage(form, response.message);
                    } else {
                        showErrorMessage(form, response.message, response.errors);
                    }
                })
                .catch(error => {
                    // Hide loading indicator
                    hideLoadingState(form);

                    // Show error message
                    showErrorMessage(form, 'There was an error submitting the form. Please try again later.');
                    console.error('Form submission error:', error);
                });
        }
    });

    // Add input event listeners for real-time validation
    Array.from(form.elements).forEach(element => {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
            element.addEventListener('input', function() {
                // Remove error message when user starts typing
                const errorElement = document.getElementById(`${element.id}-error`);
                if (errorElement) {
                    errorElement.remove();
                }
                element.classList.remove('is-invalid');
            });
        }
    });
}

/**
 * Validate the form based on the configuration
 * @param {HTMLFormElement} form - The form to validate
 * @param {Object} config - Validation configuration
 * @returns {boolean} - Whether the form is valid
 */
function validateForm(form, config) {
    let isValid = true;

    // Validate each field
    for (const fieldName in config) {
        const field = config[fieldName];
        const inputElement = form.elements[fieldName];

        if (!inputElement) continue;

        const value = inputElement.value.trim();

        // Check if required field is empty
        if (field.required && !value) {
            addErrorMessage(inputElement, field.errorMessage);
            isValid = false;
            continue;
        }

        // Skip additional validation if field is optional and empty
        if (!field.required && !value) {
            continue;
        }

        // Check minimum length
        if (field.minLength && value.length < field.minLength) {
            addErrorMessage(inputElement, field.errorMessage);
            isValid = false;
            continue;
        }

        // Check maximum length
        if (field.maxLength && value.length > field.maxLength) {
            addErrorMessage(inputElement, field.errorMessage);
            isValid = false;
            continue;
        }

        // Check pattern
        if (field.pattern && !field.pattern.test(value)) {
            addErrorMessage(inputElement, field.errorMessage);
            isValid = false;
            continue;
        }
    }

    return isValid;
}

/**
 * Add an error message below the form field
 * @param {HTMLElement} element - The form field element
 * @param {string} message - The error message
 */
function addErrorMessage(element, message) {
    // Add error class to the field
    element.classList.add('is-invalid');

    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.id = `${element.id}-error`;
    errorElement.className = 'invalid-feedback';
    errorElement.textContent = message;

    // Add error message after the field
    element.parentNode.appendChild(errorElement);
}

/**
 * Clear all error messages from the form
 * @param {HTMLFormElement} form - The form element
 */
function clearErrors(form) {
    // Remove error classes
    Array.from(form.elements).forEach(element => {
        element.classList.remove('is-invalid');
    });

    // Remove error messages
    form.querySelectorAll('.invalid-feedback').forEach(element => {
        element.remove();
    });
}

/**
 * Show the loading state of the form
 * @param {HTMLFormElement} form - The form element
 */
function showLoadingState(form) {
    // Disable submit button and show loading indicator
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

    // Disable form fields
    Array.from(form.elements).forEach(element => {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
            element.disabled = true;
        }
    });
}

/**
 * Hide the loading state of the form
 * @param {HTMLFormElement} form - The form element
 */
function hideLoadingState(form) {
    // Enable submit button and restore text
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send Message';

    // Enable form fields
    Array.from(form.elements).forEach(element => {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
            element.disabled = false;
        }
    });
}

/**
 * Submit the form data using AJAX
 * @param {HTMLFormElement} form - The form element
 * @returns {Promise} - The fetch promise
 */
function submitFormData(form) {
    // Create FormData object
    const formData = new FormData(form);

    // Convert to JSON object
    const formDataObject = Object.fromEntries(formData.entries());

    // Submit the form using fetch API
    return fetch('backend/contact_form_handler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObject)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            return response.json();
        });
}

/**
 * Show success message after form submission
 * @param {HTMLFormElement} form - The form element
 * @param {string} message - The success message
 */
function showSuccessMessage(form, message) {
    // Create success message container
    const successElement = document.createElement('div');
    successElement.className = 'alert alert-success mt-3';
    successElement.role = 'alert';
    successElement.textContent = message;

    // Insert success message after the form
    form.parentNode.insertBefore(successElement, form.nextSibling);

    // Reset the form
    form.reset();

    // Hide the success message after 5 seconds
    setTimeout(() => {
        successElement.remove();
    }, 5000);
}

/**
 * Show error message after form submission
 * @param {HTMLFormElement} form - The form element
 * @param {string} message - The error message
 * @param {Array} errors - Specific field errors (optional)
 */
function showErrorMessage(form, message, errors = []) {
    // Create error message container
    const errorElement = document.createElement('div');
    errorElement.className = 'alert alert-danger mt-3';
    errorElement.role = 'alert';

    // Add main error message
    errorElement.textContent = message;

    // Add specific field errors if provided
    if (errors && errors.length > 0) {
        const errorList = document.createElement('ul');
        errorList.className = 'mt-2 mb-0';

        errors.forEach(error => {
            const listItem = document.createElement('li');
            listItem.textContent = error;
            errorList.appendChild(listItem);
        });

        errorElement.appendChild(errorList);
    }

    // Insert error message after the form
    form.parentNode.insertBefore(errorElement, form.nextSibling);

    // Hide the error message after 5 seconds
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}
