<?php
/**
 * Contact Form Handler for CameraInspect Website
 *
 * This script processes form submissions from the contact form,
 * validates input data, and sends email notifications.
 *
 * @author CameraInspect Development Team
 * @version 1.0
 */

// Set headers to prevent caching and specify JSON response
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

// Enable CORS for same origin requests (can be modified for production)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration
$config = [
    'admin_email' => 'info@camerainspect.com',
    'support_email' => 'support@camerainspect.com',
    'sales_email' => 'sales@camerainspect.com',
    'demo_email' => 'demo@camerainspect.com',
    'debug_mode' => false, // Set to true for debugging
    'recaptcha_secret' => 'YOUR_RECAPTCHA_SECRET_KEY', // Add your reCAPTCHA secret key here
    'enable_recaptcha' => false, // Set to true to enable reCAPTCHA verification
    'log_file' => 'contact_form_logs.txt' // Log file path
];

// Initialize response array
$response = [
    'success' => false,
    'message' => '',
    'errors' => []
];

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Invalid request method.';
    echo json_encode($response);
    exit;
}

// Get the POST data
$data = json_decode(file_get_contents('php://input'), true);

// If json_decode failed, try getting data directly from $_POST
if ($data === null && empty($_POST) === false) {
    $data = $_POST;
}

// If still no data, return error
if (empty($data)) {
    $response['message'] = 'No data received.';
    echo json_encode($response);
    exit;
}

// Log the request if in debug mode
if ($config['debug_mode']) {
    error_log('Form submission: ' . print_r($data, true));
    file_put_contents($config['log_file'], date('Y-m-d H:i:s') . ' - ' . print_r($data, true) . PHP_EOL, FILE_APPEND);
}

// Validate reCAPTCHA if enabled
if ($config['enable_recaptcha'] && isset($data['g-recaptcha-response'])) {
    $recaptcha_response = $data['g-recaptcha-response'];

    // Make a request to the reCAPTCHA API
    $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
    $recaptcha_data = [
        'secret' => $config['recaptcha_secret'],
        'response' => $recaptcha_response,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ];

    $recaptcha_options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($recaptcha_data)
        ]
    ];

    $recaptcha_context = stream_context_create($recaptcha_options);
    $recaptcha_result = file_get_contents($recaptcha_url, false, $recaptcha_context);
    $recaptcha_result_json = json_decode($recaptcha_result, true);

    if (!$recaptcha_result_json['success']) {
        $response['message'] = 'reCAPTCHA verification failed.';
        echo json_encode($response);
        exit;
    }
}

// Validate required fields
$required_fields = ['name', 'email', 'message'];
$errors = [];

foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        $errors[] = "Field '{$field}' is required.";
    }
}

// Validate email format
if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email format.';
}

// If there are validation errors, return them
if (!empty($errors)) {
    $response['message'] = 'Validation failed.';
    $response['errors'] = $errors;
    echo json_encode($response);
    exit;
}

// Sanitize and prepare data
$name = filter_var($data['name'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = isset($data['phone']) ? filter_var($data['phone'], FILTER_SANITIZE_FULL_SPECIAL_CHARS) : 'Not provided';
$subject_code = isset($data['subject']) ? filter_var($data['subject'], FILTER_SANITIZE_FULL_SPECIAL_CHARS) : 'info';
$message = filter_var($data['message'], FILTER_SANITIZE_FULL_SPECIAL_CHARS);

// Determine the subject based on the selection
$subject_map = [
    'info' => 'General Information Request',
    'demo' => 'Demo Request',
    'quote' => 'Pricing Quote Request',
    'support' => 'Technical Support Request',
    'other' => 'Other Inquiry'
];

$subject = isset($subject_map[$subject_code]) ? $subject_map[$subject_code] : 'Website Contact Form';

// Determine recipient email based on subject
$recipient = $config['admin_email']; // Default recipient

switch ($subject_code) {
    case 'support':
        $recipient = $config['support_email'];
        break;
    case 'demo':
        $recipient = $config['demo_email'];
        break;
    case 'quote':
        $recipient = $config['sales_email'];
        break;
}

// Prepare email headers
$headers = [
    'From: ' . $email,
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/html; charset=UTF-8'
];

// Prepare email body
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0056b3; color: white; padding: 10px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .footer { font-size: 12px; text-align: center; margin-top: 20px; color: #777; }
        .field { margin-bottom: 10px; }
        .field-name { font-weight: bold; }
        .message-text { background-color: #f9f9f9; padding: 10px; border-left: 3px solid #0056b3; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>CameraInspect Contact Form</h2>
        </div>
        <div class='content'>
            <p>A new message has been submitted through the website contact form:</p>

            <div class='field'>
                <div class='field-name'>Name:</div>
                <div>{$name}</div>
            </div>

            <div class='field'>
                <div class='field-name'>Email:</div>
                <div>{$email}</div>
            </div>

            <div class='field'>
                <div class='field-name'>Phone:</div>
                <div>{$phone}</div>
            </div>

            <div class='field'>
                <div class='field-name'>Subject:</div>
                <div>{$subject}</div>
            </div>

            <div class='field'>
                <div class='field-name'>Message:</div>
                <div class='message-text'>{$message}</div>
            </div>
        </div>
        <div class='footer'>
            <p>This email was sent from the CameraInspect website contact form.</p>
            <p>IP Address: {$_SERVER['REMOTE_ADDR']} | Date: " . date('Y-m-d H:i:s') . "</p>
        </div>
    </div>
</body>
</html>
";

// Send email
$mail_sent = mail($recipient, "CameraInspect Contact: {$subject}", $email_body, implode("\r\n", $headers));

// Send confirmation email to the user
$confirmation_subject = "Your message to CameraInspect has been received";
$confirmation_body = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0056b3; color: white; padding: 10px; text-align: center; }
        .content { padding: 20px; border: 1px solid #ddd; }
        .footer { font-size: 12px; text-align: center; margin-top: 20px; color: #777; }
        .thank-you { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Thank You for Contacting CameraInspect</h2>
        </div>
        <div class='content'>
            <p class='thank-you'>Dear {$name},</p>

            <p>Thank you for contacting CameraInspect. We have received your message regarding '{$subject}'.</p>

            <p>A member of our team will review your inquiry and get back to you as soon as possible. During business hours, we typically respond within 4 hours.</p>

            <p>For your reference, here is a copy of your message:</p>

            <div style='background-color: #f9f9f9; padding: 10px; border-left: 3px solid #0056b3;'>
                {$message}
            </div>

            <p>If you need immediate assistance, please call our support line at +48 22 123 45 68.</p>

            <p>Best regards,<br>The CameraInspect Team</p>
        </div>
        <div class='footer'>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© " . date('Y') . " CameraInspect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
";

$confirmation_headers = [
    'From: ' . $config['admin_email'],
    'Reply-To: ' . $config['admin_email'],
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/html; charset=UTF-8'
];

$confirmation_sent = mail($email, $confirmation_subject, $confirmation_body, implode("\r\n", $confirmation_headers));

// Create an entry in database (example code, needs to be adapted to your DB structure)
try {
    if ($config['debug_mode']) {
        // Simulate database operation in debug mode
        error_log('Would save to database: ' . print_r([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'subject' => $subject,
            'message' => $message,
            'ip' => $_SERVER['REMOTE_ADDR'],
            'date' => date('Y-m-d H:i:s')
        ], true));
    } else {
        // Uncomment and configure this section to connect to your actual database
        /*
        $db = new PDO('mysql:host=localhost;dbname=your_database', 'username', 'password');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $db->prepare('INSERT INTO contact_submissions (name, email, phone, subject, message, ip, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())');
        $stmt->execute([$name, $email, $phone, $subject, $message, $_SERVER['REMOTE_ADDR']]);
        */
    }

    $db_success = true;
} catch (Exception $e) {
    // Log the error but don't expose it to the user
    error_log('Database error: ' . $e->getMessage());
    $db_success = false;
}

// Prepare the response
if ($mail_sent) {
    $response['success'] = true;
    $response['message'] = 'Thank you for your message. We will contact you soon!';
} else {
    $response['message'] = 'There was a problem sending your message. Please try again later or contact us directly.';
}

// Add additional information for debugging
if ($config['debug_mode']) {
    $response['debug'] = [
        'mail_sent' => $mail_sent,
        'confirmation_sent' => $confirmation_sent,
        'db_success' => $db_success,
        'recipient' => $recipient,
        'time' => date('Y-m-d H:i:s')
    ];
}

// Return the JSON response
echo json_encode($response);
exit;
