<?php
// Simple Contact Form Handler for Connect Digitals
// This script handles form submissions using basic PHP mail() function

// Set error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type to JSON
header('Content-Type: application/json');

// Configuration
$to_email = "digitalsconnect@gmail.com"; // Your email address
$from_name = "Connect Digitals Contact Form";
$subject_prefix = "New Contact Form Submission - ";

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get form data and sanitize
    $name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
    $email = isset($_POST['email']) ? trim(htmlspecialchars($_POST['email'])) : '';
    $message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';
    
    // Log the received data for debugging
    error_log("Contact form submission - Name: $name, Email: $email, Message: $message");
    
    // Basic validation
    $errors = array();
    
    if (empty($name) || strlen($name) < 2) {
        $errors[] = "Name must be at least 2 characters long.";
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Please enter a valid email address.";
    }
    
    if (empty($message) || strlen($message) < 10) {
        $errors[] = "Message must be at least 10 characters long.";
    }
    
    // Check for honeypot field (spam protection)
    if (!empty($_POST['bot-field'])) {
        // This is likely a bot, silently ignore
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Thank you for your message!']);
        exit;
    }
    
    // If there are validation errors, return them
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }
    
    // Prepare email content
    $email_subject = $subject_prefix . $name;
    
    $email_body = "
    New contact form submission from Connect Digitals website:
    
    Name: {$name}
    Email: {$email}
    Message: {$message}
    
    ---
    This email was sent from the contact form on your website.
    ";
    
    // Email headers
    $headers = array();
    $headers[] = "From: {$from_name} <noreply@" . $_SERVER['HTTP_HOST'] . ">";
    $headers[] = "Reply-To: {$email}";
    $headers[] = "X-Mailer: PHP/" . phpversion();
    $headers[] = "Content-Type: text/plain; charset=UTF-8";
    $headers[] = "MIME-Version: 1.0";
    
    // Try to send email
    $mail_sent = mail($to_email, $email_subject, $email_body, implode("\r\n", $headers));
    
    if ($mail_sent) {
        // Success response
        http_response_code(200);
        echo json_encode([
            'success' => true, 
            'message' => 'Thank you for your message! We will get back to you soon.'
        ]);
        
        // Log success
        error_log("Email sent successfully to $to_email");
        
        // Optional: Send confirmation email to user (if mail() works)
        $user_subject = "Thank you for contacting Connect Digitals";
        $user_body = "
        Dear {$name},
        
        Thank you for reaching out to Connect Digitals. We have received your message and will get back to you as soon as possible.
        
        Your message:
        {$message}
        
        Best regards,
        Connect Digitals Team
        ";
        
        $user_headers = array();
        $user_headers[] = "From: Connect Digitals <noreply@" . $_SERVER['HTTP_HOST'] . ">";
        $user_headers[] = "Content-Type: text/plain; charset=UTF-8";
        $user_headers[] = "MIME-Version: 1.0";
        
        // Try to send confirmation email (don't fail if this doesn't work)
        @mail($email, $user_subject, $user_body, implode("\r\n", $user_headers));
        
    } else {
        // Try alternative method - save to file
        $log_file = 'contact_submissions.txt';
        $log_entry = date('Y-m-d H:i:s') . " - Name: {$name}, Email: {$email}, Message: {$message}\n";
        
        if (file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX)) {
            // Success - saved to file
            http_response_code(200);
            echo json_encode([
                'success' => true, 
                'message' => 'Thank you for your message! We will get back to you soon.'
            ]);
            
            // Log success
            error_log("Contact form data saved to file successfully");
            
        } else {
            // Error response
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'message' => 'Sorry, there was an error sending your message. Please try again or contact us directly at digitalsconnect@gmail.com'
            ]);
            
            // Log error
            error_log("Failed to send email or save to file");
        }
    }
    
} else {
    // Not a POST request
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?> 