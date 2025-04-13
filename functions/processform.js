//import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
export async function onRequestPost(context) {
  try {
    return await handleRequest(context);
  } catch (e) {
    console.error(e);
    return new Response("Error sending message", { status: 500 });
  }
}
class ElementHandler {
  constructor(options) {this.options = options;}
  element(element) {
    // An incoming element, such as `div`
    //console.log(`Incoming element: ${element.tagName}`);
    // replace form with a   
      const thanksmsg = `<p>${this.options.name} thanks for submitting the form. One of the team will contact you.</p>`
      element.replace(thanksmsg, { html: true })
  }
}

async function handleRequest({ request, env }) {
    /**
     * rawHtmlResponse returns HTML inputted directly
     * into the worker script
     * @param {string} html
     */
    function rawHtmlResponse(html) {
      return new Response(html, {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      });
    }
    /**
     * readRequestBody reads in the incoming request body
     * Use await readRequestBody(..) in an async function to get the string
     * @param {Request} request the incoming request to read from
     */
    async function readRequestBody(request) {
      const contentType = request.headers.get("content-type");
      if (contentType.includes("form")) {
        const formData = await request.formData();
        const body = {};
        for (const entry of formData.entries()) {
          body[entry[0]] = entry[1];
        }
        return body;
      } else {
        // Perhaps some other type of data was submitted in the form
        // like an image, or some other binary data.
        return "shouldn't have happened";
      }
    }
      // Send email to team
    async function sendemailtobackoffice(request, formreceived) {
      var bodyofemail = '';
      for (const field in formreceived) {
        bodyofemail = bodyofemail + `${field}: ${formreceived[field]}\n`;
      }
      const emailbody = 
      {
        "from": {
            "email": "form-submission@place-marketing.com", "name": "Place Marketing Form Submission"
        },
            "to": [
            {
              "email": "nick@place-marketing.com", "name": "Nick Smillie"
            }             
          ],
          "cc": [
              {
                "email": "simon@place-marketing.com", "name": "Simon Tomlinson"
              }
            ],            
            "bcc": [
            {
              "email": "dklongley@gmail.com", "name": "Dind"
            }
          ],
        "subject": "place-marketing "+formreceived.sender+" request",
        "text": bodyofemail, //"url.pathname "+requrl+" the request method was"+request.method+" you submitted the following email address "+formReceived.fields.email+" hidden name of the form "+formReceived.fields.sender,
        "html": bodyofemail.replaceAll('\n','<br>') //"url.pathname "+requrl+" the request method was"+request.method+" you submitted the following email address "+formReceived.fields.email+" hidden name of the form "+formReceived.fields.sender
      }
      const result = await fetch(`https://api.mailersend.com/v1/email`, {
          method: 'POST',
          body: JSON.stringify(emailbody),
          headers: {
            'Authorization': 'Bearer '+env.MS_TKN,
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            
          }
        })
    };
    if (request.method === "POST") {
      const reqBody = await readRequestBody(request);
      const mailersendresponse = await sendemailtobackoffice(request, reqBody) 
      const url = new URL(request.url)
      //console.log("url hostname"+url.hostname)
      var redirecturl = url.protocol+'//'+url.hostname
      if(url.port !== '80'){ redirecturl = redirecturl +':'+url.port }
      //console.log('sender = '+reqBody['sender']);
      const templateurl = redirecturl+'/'+reqBody['sender']+".html";
      //console.log('templateurl = '+templateurl);
      const thankyou = await fetch(templateurl);
      const options = {"type":reqBody['sender'],"useremail":reqBody['email'],"name":reqBody['name']}
      return new HTMLRewriter()
      .on('form', new ElementHandler(options))
      .transform(thankyou);
      //return Response.redirect(redirecturl+'/thankyou');
      
    } else if (request.method === "GET") {
      return new Response("The request was a GET");
    }
  };