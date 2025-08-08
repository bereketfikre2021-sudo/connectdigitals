<?php
// Contact Form Handler for Connect Digitals
// This script handles form submissions and sends emails using SMTP

// Set error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include PHPMailer (you'll need to install this)
// Download from: https://github.com/PHPMailer/PHPMailer
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';
require 'PHPMailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Configuration
$to_email = "digitalsconnect@gmail.com"; // Your email address
$smtp_host = "smtp.gmail.com"; // Gmail SMTP
$smtp_port = 587; // TLS port
$smtp_username = "your-email@gmail.com"; // Your Gmail address
$smtp_password = "your-app-password"; // Gmail App Password

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Get form data and sanitize
    $name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
    $email = isset($_POST['email']) ? trim(htmlspecialchars($_POST['email'])) : '';
    $message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';
    
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
    
    try {
        // Create PHPMailer instance
        $mail = new PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = $smtp_host;
        $mail->SMTPAuth = true;
        $mail->Username = $smtp_username;
        $mail->Password = $smtp_password;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $smtp_port;
        
        // Recipients
        $mail->setFrom($smtp_username, 'Connect Digitals Contact Form');
        $mail->addAddress($to_email, 'Connect Digitals');
        $mail->addReplyTo($email, $name);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Contact Form Submission - " . $name;
        $mail->Body = "
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {$name}</p>
        <p><strong>Email:</strong> {$email}</p>
        <p><strong>Message:</strong></p>
        <p>" . nl2br($message) . "</p>
        <hr>
        <p><em>This email was sent from the contact form on your website.</em></p>
        ";
        
        $mail->AltBody = "
        New contact form submission from Connect Digitals website:
        
        Name: {$name}
        Email: {$email}
        Message: {$message}
        
        ---
        This email was sent from the contact form on your website.
        ";
        
        // Send email to you
        $mail->send();
        
        // Send confirmation email to user
        $userMail = new PHPMailer(true);
        
        // Server settings for user email
        $userMail->isSMTP();
        $userMail->Host = $smtp_host;
        $userMail->SMTPAuth = true;
        $userMail->Username = $smtp_username;
        $userMail->Password = $smtp_password;
        $userMail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $userMail->Port = $smtp_port;
        
        // Recipients for user email
        $userMail->setFrom($smtp_username, 'Connect Digitals');
        $userMail->addAddress($email, $name);
        
        // Content for user email
        $userMail->isHTML(true);
        $userMail->Subject = "Thank you for contacting Connect Digitals";
        $userMail->Body = "
        <h2>Thank you for contacting Connect Digitals!</h2>
        <p>Dear {$name},</p>
        <p>Thank you for reaching out to Connect Digitals. We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong></p>
        <p>" . nl2br($message) . "</p>
        <hr>
        <p>Best regards,<br>Connect Digitals Team</p>
        ";
        
        $userMail->AltBody = "
        Dear {$name},
        
        Thank you for reaching out to Connect Digitals. We have received your message and will get back to you as soon as possible.
        
        Your message:
        {$message}
        
        Best regards,
        Connect Digitals Team
        ";
        
        // Send confirmation email
        $userMail->send();
        
        // Success response
        http_response_code(200);
        echo json_encode([
            'success' => true, 
            'message' => 'Thank you for your message! We will get back to you soon.'
        ]);
        
    } catch (Exception $e) {
        // Error response
        http_response_code(500);
        echo json_encode([
            'success' => false, 
            'message' => 'Sorry, there was an error sending your message. Please try again or contact us directly.',
            'debug' => $mail->ErrorInfo
        ]);
    }
    
} else {
    // Not a POST request
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?> 