import os
from datetime import datetime, timezone
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def utccurrent():
    return datetime.now(timezone.utc)

class EmailService:
    @staticmethod
    def send_booking_confirmation(*, to_email: str, subject: str, html_content: str) -> None:
        api_key = os.getenv("SENDGRID_API_KEY")
        from_email = os.getenv("FROM_EMAIL")
        
        if not api_key:
            raise RuntimeError("SENDGRID_API_KEY is required")
        if not from_email:
            raise RuntimeError("FROM_EMAIL is required")
        if not to_email:
            raise ValueError("Recipient email is required")
        
        message = Mail(
            from_email=from_email,
            to_emails=to_email,
            subject=subject,
            html_content=html_content,
        )
        
        sg = SendGridAPIClient(api_key)
        sg.send(message)
        
