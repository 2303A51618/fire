"""
Email service for sending fire detection alerts via Brevo SMTP
"""
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Optional

logger = logging.getLogger(__name__)


class EmailService:
    """Handles sending email alerts via SMTP"""

    def __init__(
        self,
        smtp_server: str,
        smtp_port: int,
        login: str,
        password: str,
        from_email: str,
    ):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.login = login
        self.password = password
        self.from_email = from_email

    def send_alert_email(
        self,
        to_email: str,
        confidence: float,
        timestamp: datetime,
        alert_threshold: float,
        latitude: float = None,
        longitude: float = None,
    ) -> bool:
        """
        Send fire detection alert email

        Args:
            to_email: Recipient email address
            confidence: Confidence score of the fire detection
            timestamp: Timestamp of the detection
            alert_threshold: Threshold that was exceeded

        Returns:
            True if email sent successfully, False otherwise
        """
        try:
            subject = "🚨 Fire Detection Alert - Immediate Action Required"

            location_html = ""
            location_text = ""
            if latitude is not None and longitude is not None:
                location_html = f"""
                                <div class=\"detail-item\">
                                    <span class=\"label\">Coordinates:</span>
                                    <span class=\"value\">{latitude:.6f}, {longitude:.6f}</span>
                                </div>
                                <div class=\"detail-item\">
                                    <span class=\"label\">Map Link:</span>
                                    <span class=\"value\"><a href=\"https://maps.google.com/?q={latitude},{longitude}\">Open in Google Maps</a></span>
                                </div>
                """
                location_text = (
                    f"- Coordinates: {latitude:.6f}, {longitude:.6f}\n"
                    f"- Map Link: https://maps.google.com/?q={latitude},{longitude}\n"
                )

            # Create HTML email body
            html_body = f"""
            <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; }}
                        .container {{ max-width: 600px; margin: 0 auto; }}
                        .header {{ background-color: #dc3545; color: white; padding: 20px; text-align: center; }}
                        .content {{ padding: 20px; background-color: #f8f9fa; }}
                        .alert-box {{ background-color: #fff3cd; border-left: 4px solid #dc3545; padding: 15px; margin: 10px 0; }}
                        .details {{ margin: 15px 0; }}
                        .detail-item {{ margin: 10px 0; }}
                        .label {{ font-weight: bold; color: #333; }}
                        .value {{ color: #555; }}
                        .footer {{ text-align: center; color: #888; font-size: 12px; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ddd; }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>FIRE DETECTED</h1>
                        </div>
                        <div class="content">
                            <p>A fire has been detected by the Fire Detection System.</p>
                            
                            <div class="alert-box">
                                <p><strong>This requires immediate investigation and action!</strong></p>
                            </div>
                            
                            <div class="details">
                                <div class="detail-item">
                                    <span class="label">Detection Time:</span>
                                    <span class="value">{timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Confidence Level:</span>
                                    <span class="value">{confidence:.2%}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="label">Alert Threshold:</span>
                                    <span class="value">{alert_threshold:.2%}</span>
                                </div>
                                {location_html}
                            </div>
                            
                            <p><strong>Recommended Actions:</strong></p>
                            <ul>
                                <li>Check the monitored area immediately</li>
                                <li>Contact emergency services if fire is confirmed</li>
                                <li>Review camera footage for additional context</li>
                                <li>Log into the dashboard for more details</li>
                            </ul>
                            
                            <div class="footer">
                                <p>This is an automated alert from the Forest Fire Detection System.</p>
                                <p>Do not reply to this email.</p>
                            </div>
                        </div>
                    </div>
                </body>
            </html>
            """

            # Create plain text version
            text_body = f"""
FIRE DETECTED - IMMEDIATE ACTION REQUIRED

A fire has been detected by the Fire Detection System.

Detection Details:
- Detection Time: {timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}
- Confidence Level: {confidence:.2%}
- Alert Threshold: {alert_threshold:.2%}
{location_text}

Recommended Actions:
1. Check the monitored area immediately
2. Contact emergency services if fire is confirmed
3. Review camera footage for additional context
4. Log into the dashboard for more details

---
This is an automated alert from the Forest Fire Detection System.
Do not reply to this email.
            """

            # Send email
            self._send_smtp_email(to_email, subject, text_body, html_body)
            logger.info(f"Alert email sent successfully to {to_email}")
            return True

        except Exception as e:
            logger.error(f"Failed to send alert email: {str(e)}")
            return False

    def _send_smtp_email(
        self, to_email: str, subject: str, text_body: str, html_body: str
    ) -> None:
        """
        Send email via SMTP

        Args:
            to_email: Recipient email address
            subject: Email subject
            text_body: Plain text body
            html_body: HTML body

        Raises:
            Exception if email sending fails
        """
        try:
            # Create message
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = self.from_email
            msg["To"] = to_email

            # Attach both plain text and HTML versions
            msg.attach(MIMEText(text_body, "plain"))
            msg.attach(MIMEText(html_body, "html"))

            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.login, self.password)
            server.sendmail(self.from_email, to_email, msg.as_string())
            server.quit()

            logger.debug(f"SMTP email sent to {to_email}")

        except smtplib.SMTPException as e:
            logger.error(f"SMTP error while sending email: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error while sending email: {str(e)}")
            raise

    def test_connection(self) -> bool:
        """
        Test SMTP connection

        Returns:
            True if connection successful, False otherwise
        """
        try:
            # Keep startup resilient on platforms where outbound SMTP may be delayed/blocked.
            server = smtplib.SMTP(self.smtp_server, self.smtp_port, timeout=12)
            server.starttls()
            server.login(self.login, self.password)
            server.quit()
            logger.info("SMTP connection test successful")
            return True
        except Exception as e:
            logger.warning(f"SMTP connection test failed (non-blocking): {str(e)}")
            return False
