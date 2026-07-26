// ============================================
// Google Apps Script - Portfolio Contact Form
// ============================================
// এই কোডটি https://script.google.com -এ paste করতে হবে
// ============================================

function doPost(e) {
  try {
    // ফর্ম থেকে ডাটা নেওয়া (FormData format)
    const name = e.parameter.NAME || "Not provided";
    const email = e.parameter.EMAIL || "Not provided";
    const phone = e.parameter.PHONE || "Not provided";
    const subject = e.parameter.SUBJECT || "No Subject";
    const message = e.parameter.MESSAGE || "No Message";
    
    // যে ইমেইলে মেসেজ পাঠাবে (আপনার Gmail)
    const recipient = "pbon99449@gmail.com";
    
    // ইমেইলের বিষয়
    const emailSubject = "📬 Portfolio Contact: " + subject;
    
    // Logo URL (imgbb থেকে direct link)
    const logoUrl = "https://i.ibb.co/HTFSJ34d/logo12.png";
    
    // HTML ইমেইল বডি
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #202020, #333333);
            padding: 30px;
            text-align: center;
            border-bottom: 4px solid #fed700;
          }
          .header img {
            max-width: 120px;
            height: auto;
            margin-bottom: 10px;
          }
          .header h1 {
            color: #fed700;
            font-size: 24px;
            margin: 10px 0 0 0;
            font-weight: 700;
          }
          .header p {
            color: #e5e5e5;
            font-size: 14px;
            margin: 5px 0 0 0;
          }
          .content {
            padding: 30px;
          }
          .field {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 10px;
            border-left: 4px solid #fed700;
          }
          .field-label {
            font-size: 12px;
            text-transform: uppercase;
            color: #888;
            font-weight: 600;
            letter-spacing: 1px;
            margin-bottom: 5px;
          }
          .field-value {
            font-size: 16px;
            color: #333;
            font-weight: 500;
          }
          .message-box {
            background-color: #f0f0f0;
            padding: 20px;
            border-radius: 10px;
            margin-top: 10px;
            line-height: 1.6;
            color: #444;
            font-style: italic;
          }
          .footer {
            background-color: #202020;
            padding: 20px;
            text-align: center;
            color: #888;
            font-size: 12px;
          }
          .footer a {
            color: #fed700;
            text-decoration: none;
          }
          .badge {
            display: inline-block;
            background-color: #fed700;
            color: #202020;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header with Logo -->
          <div class="header">
            <img src="${logoUrl}" alt="Plabon Portfolio Logo" />
            <h1>✨ Plabon Portfolio ✨</h1>
            <p>📬 New Contact Message Received</p>
          </div>
          
          <!-- Content -->
          <div class="content">
            <div style="text-align: center; margin-bottom: 25px;">
              <span class="badge">💌 New Message</span>
            </div>
            
            <div class="field">
              <div class="field-label">👤 Name</div>
              <div class="field-value">${name}</div>
            </div>
            
            <div class="field">
              <div class="field-label">📧 Email</div>
              <div class="field-value">${email}</div>
            </div>
            
            <div class="field">
              <div class="field-label">📞 Phone</div>
              <div class="field-value">${phone}</div>
            </div>
            
            <div class="field">
              <div class="field-label">📋 Subject</div>
              <div class="field-value">${subject}</div>
            </div>
            
            <div class="field">
              <div class="field-label">💬 Message</div>
              <div class="message-box">${message}</div>
            </div>
            
            <div style="text-align: center; margin-top: 25px; padding: 15px; background-color: #fffde7; border-radius: 10px;">
              <p style="margin: 0; color: #666;">⭐ This message was sent from your portfolio website</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p>© 2026 <a href="#">Plabon Portfolio</a> | All Rights Reserved</p>
            <p style="margin-top: 5px;">🚀 Built with passion and creativity</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Plain text version (fallback)
    const plainBody = "You have received a new message from your portfolio website:\n\n" +
                      "Name: " + name + "\n" +
                      "Email: " + email + "\n" +
                      "Phone: " + phone + "\n" +
                      "Subject: " + subject + "\n\n" +
                      "Message:\n" + message;
    
    // ইমেইল পাঠানো (HTML format) — "me" এর জায়গায় "Plabon Portfolio" দেখাবে
    MailApp.sendEmail({
      to: recipient,
      subject: emailSubject,
      htmlBody: htmlBody,
      body: plainBody,
      name: "Plabon Portfolio"
    });
    
    // সফল রেসপন্স পাঠানো
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // এরর থাকলে রেসপন্স
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return doPost(e);
}