import { EMAIL_USER, FRONTEND_URL } from './../config/dotenvx';
import { IUser } from "../types";
import transporter from "../config/emailConfig";
import path from "path";
import fs from "fs"

const loginTemplatePath = path.join(__dirname, "../config/emailTemplates/loginNotificationEmail.html");
const welcomeTemplatePath = path.join(__dirname, "../config/emailTemplates/welcomeEmail.html");
const twoFactorAuthTemplatePath = path.join(__dirname, "../config/emailTemplates/2faVerifyOTPEmail.html");
const accountVerificationTemplatePath = path.join(__dirname, "../config/emailTemplates/accountVerificationEmail.html");
const passwordResetTemplatePath = path.join(__dirname, "../config/emailTemplates/passwordResetEmail.html");
const passwordChangedNotificationTemplatePath = path.join(__dirname, "../config/emailTemplates/passwordChangedNotificationEmail.html");
const newAddressAddedNotificationTemplatePath = path.join(__dirname, "../config/emailTemplates/newAddressAddedNotificationEmail.html");
const newPaymentMethodAddedNotificationTemplatePath = path.join(__dirname, "../config/emailTemplates/newPaymentMethodAddedNotificationEmail.html");

function formatDateTime(date: Date): string {
  const options: any = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // Use 12-hour clock
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat('default', options).format(date);
}
const currentDateTime = formatDateTime(new Date());
// console.log(currentDateTime);


async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: `"AshStore" <${EMAIL_USER}>`,
      // to: `<${to}> , <zulqarnainkhan020@gmail.com>`,
      // to: `<${to}> , <hk6230537@gmail.com>`,
      to,
      subject,
      html
    });

    console.log(`>>>: Email sent to: ${to},\n Email id: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


//////////////////////////////** Emails Below **//////////////////////////////

//** DONE **//
function sendWelcomeEmail(user: IUser) {
  const subject = "🎉 Welcome to AshStore ✨ Your style journey starts here!";
  // Load email template
  let html = fs.readFileSync(welcomeTemplatePath, "utf-8");
  // Replace placeholders
  html = html
    .replace("{{name}}", user.name || user.username)
    .replace("{{time}}", currentDateTime)
    .replace("{{frontend}}", `${FRONTEND_URL}`)
    .replace("{{verifyLink}}", `${FRONTEND_URL}/verify-account`);

  sendEmail(user.email, subject, html);
}

//** DONE **//
function sendLoginNotificationEmail(user: IUser, location: { ip?: string; geo?: string; device?: string }) {
  const subject = "New Login to Your AshStore Account";
  // Load email template
  let html = fs.readFileSync(loginTemplatePath, "utf-8");
  // Replace placeholders
  html = html
    .replace("{{name}}", user.name || user.username)
    .replace("{{time}}", formatDateTime(new Date()))
    .replace("{{ip}}", location.ip || "Unknown IP")
    .replace("{{location}}", location.geo || "Unknown Location")
    .replace("{{device}}", location.device || "Unknown Device")
    .replace("{{resetLink}}", `${FRONTEND_URL}/reset-password`);

  sendEmail(user.email, subject, html);
}

//** DONE **//
function sendPasswordResetEmail(user: IUser, resetLink: string) {
  const subject = "Reset Your Password - AshStore E-commerce Website";

  const html = fs.readFileSync(passwordResetTemplatePath, "utf-8")
    .replace("{{name}}", user.name || user.username)
    .replace("{{email}}", user.email)
    .replace("{{time}}", currentDateTime)
    .replace("{{resetLink}}", resetLink);

  sendEmail(user.email, subject, html);
}

//** DONE **//
function sendPasswordChangedNotificationEmail(user: IUser, location: { ip?: string; geo?: string; device?: string }) {
  const subject = "Your Password Was Changed - AshStore Ecommerce Website";
  const html = fs.readFileSync(passwordChangedNotificationTemplatePath, "utf-8")
    .replace("{{name}}", user.name || user.username)
    .replace("{{email}}", user.email)
    .replace("{{time}}", currentDateTime)
    .replace("{{ip}}", location.ip || "Unknown IP")
    .replace("{{location}}", location.geo || "Unknown Location")
    .replace("{{device}}", location.device || "Unknown Device")
    .replace("{{supportLink}}", `${FRONTEND_URL}/support`);

  sendEmail(user.email, subject, html);
}

//** DONE **//
function sendTwoFactorAuthOTPEmail(user: IUser, otp: string, expiryMinutes: number, expiryTime: Date) {
  const subject = "Your Two-Factor Authentication Code - AshStore Ecommerce Website";
  const html = fs.readFileSync(twoFactorAuthTemplatePath, "utf-8")
    .replace("{{name}}", user.name || user.username)
    .replace("{{otp}}", otp)
    .replace("{{expiry}}", expiryMinutes.toString())
    .replace("{{expiryTime}}", formatDateTime(expiryTime));

  sendEmail(user.email, subject, html);
}

//** Done **//
function sendAccountVerificationEmail(user: IUser, verifyLink: string, location: { ip?: string; geo?: string; device?: string }) {
  const subject = "Verify Your Email - AshStore Ecommerce Website";
  const html = fs.readFileSync(accountVerificationTemplatePath, "utf-8")
    .replace("{{name}}", user.name || user.username)
    .replace("{{email}}", user.email)
    .replace("{{time}}", currentDateTime)
    .replace("{{location}}", `${location.ip} - ${location.geo}` || "Unknown Location")
    .replace("{{device}}", location.device || "Unknown Device")
    .replace("{{verificationLink}}", verifyLink)
    .replace("{{supportLink}}", `${FRONTEND_URL}/contact`);

  sendEmail(user.email, subject, html);
}

//** Done **//
function sendAddressAddedEmail(name: string, email: string, location: { ip?: string; geo?: string; device?: string }, newAddress: any) {
  const subject = "New Shipping Address Added to Your AshStore Account";
  const html = fs.readFileSync(newAddressAddedNotificationTemplatePath, "utf-8")
    .replace("{{name}}", name)
    .replace("{{email}}", email)
    .replace("{{time}}", currentDateTime)
    .replace("{{location}}", `${location.ip} - ${location.geo}` || "Unknown Location")
    .replace("{{device}}", location.device || "Unknown Device")

    .replace("{{isDefault}}", (newAddress.isDefault ? "Yes" : "No"))
    .replace("{{addressLine1}}", newAddress.addressLine1 || "- ")
    .replace("{{addressLine2}}", newAddress.addressLine2 || "- ")
    .replace("{{city}}", newAddress.city || "- ")
    .replace("{{state}}", newAddress.stateProvince || "- ")
    .replace("{{zipCode}}", newAddress.postalCode || "- ")
    .replace("{{country}}", newAddress.country || "-")

    .replace("{{accountSettingsLink}}", `${FRONTEND_URL}/user/account/address-info`);

  sendEmail(email, subject, html);
}
//** PENDING **//
function sendPaymentMethodAddedEmail(name: string, email: string, location: { ip?: string; geo?: string; device?: string }, newPaymentMethod: any) {
  let paymentData: any;

  if (newPaymentMethod.type === "card") {
    paymentData = {
      "Card Number ": newPaymentMethod.cardNumber || "-",
      "Expiration Date ": newPaymentMethod.expirationDate || "-",
    }
  }
  else if (newPaymentMethod.type === "easypaisa" || newPaymentMethod.type === "jazzcash") {
    paymentData = {
      "Phone Number ": newPaymentMethod.phoneNumber || "-",
      "Transaction Id ": newPaymentMethod.transactionId || "-",
    }
  }
  else {
    return console.debug(`\n>>>:DEBUG	: Invalid Payment Data! Debugging!\n`);
  }


  const paymentDataKeys = Object.keys(paymentData);

  const subject = "New Payment Method Added to Your AshStore Account";
  const html = fs.readFileSync(newPaymentMethodAddedNotificationTemplatePath, "utf-8")
    .replace("{{name}}", name)
    .replace("{{email}}", email)
    .replace("{{time}}", currentDateTime)
    .replace("{{location}}", `${location.ip} - ${location.geo}` || "Unknown Location")
    .replace("{{device}}", location.device || "Unknown Device")
    .replace("{{isDefault}}", (newPaymentMethod.isDefault ? "Yes" : "No"))
    .replace("{{paymentType}}", newPaymentMethod.type || "Unknown")

    .replace("{{key1}}", paymentDataKeys[0])
    .replace("{{key1data}}", paymentData[paymentDataKeys[0]])
    .replace("{{key2}}", paymentDataKeys[1])
    .replace("{{key2data}}", paymentData[paymentDataKeys[1]])

    .replace("{{accountSettingsLink}}", `${FRONTEND_URL}/user/account/payment-methods`);

  sendEmail(email, subject, html);
}


export { sendEmail, sendPasswordResetEmail, sendWelcomeEmail, sendLoginNotificationEmail, sendPasswordChangedNotificationEmail, sendTwoFactorAuthOTPEmail, sendAccountVerificationEmail, sendAddressAddedEmail, sendPaymentMethodAddedEmail };

