export function adminNotificationEmail({
  first_name,
  request_type,
  email,
  last_name,
  title,
  location,
  bedrooms,
  bathrooms,
  size,
  formattedPrice,
  image,
  property_id,
  message,
  number,
}: {
  first_name: string;
  request_type: string;
  email: string;
  last_name: string;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  formattedPrice: number;
  image: string;
  property_id: string;
  message: string;
  number: number;
}) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tour Confirmation</title>
    <style>
      /* Reset and base styles */
      body,
      p,
      h1,
      h2,
      h3,
      div {
        margin: 0;
        padding: 0;
      }
      body {
        font-family: Arial, sans-serif;
        background-color: #ffffff;
        padding: 0;
      }
.header{
background-color:#ffffff;
margin: 0;
display:flex;
padding: 10px 20px;
align-items: center;
}

.container-1 {
background-color:#f4f4f4;
max-width: 600px;
padding: 20px;
align-items: center;

}
      .container {
        background-color: #ffffff;
        color: white;
        margin: 0;
        padding: 30px;
        border-radius: 8px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
      }
      h1 {
        font-size: 24px;
        color: #111827;
margin-bottom: 20px
      }
      p {
        font-size: 16px;
        line-height: 1.5;
color: black;
margin-bottom: 5px;
      }
      .highlight {
        font-weight: bold;
        color: #111827;
      }
.divider{
height: 1px;
width: 100%;
background-color: #111827;
opacity: 15%;
margin: 20px 0;
}
      /* Responsive */
      @media only screen and (max-width: 480px) {
        body {
          padding: 10px;
        }
        .container {
          padding: 20px;
margin-bottom: 15px
        }
        h1 {
          font-size: 16px;
        }
        p {
          font-size: 14px;}
        .p2 {
        font-size: 16px;
        font-weight: bold;
        }
.price {
color: #7099FF !important;
}
        .logo-container {
        height: 25px;
        width: 25px;
        border-radius: 1000px;
        margin-right: 20px;
        background-image: url('https://gmblux.com/gmblogo.JPG');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
         }

.property-image {
height: 200px;
width: 100%;
border-radius: 12px;
overflow: hidden;
background-image: url('${image}');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
margin-bottom: 10px;
}

.pair {
display: flex;
margin-right: 10px;

}

.pair img {
height: 16px;
width: 16px;
margin-right: 5px;
}


.logo-text {
font-size: 16px;
font-weight: medium;
color: #111827;
}
.bbs {
display: flex;
gap: 10px;
}

.socials {
display:flex;
}
.socials a {
margin-right: 10px;
}
.socials a img {
height: 16px;
}
      }
    @media (prefers-color-scheme: dark) {
      body {
        background-color:  #121420 !important;
        color: #e0e0e0 !important;
      }
      a {
        color: #9ecfff !important;
      }
.header, .container {
        background-color: #121420 !important;
      }}
    </style>
  </head>
  <body>
<div class="header">
<div class="logo-container"></div><p class="logo-text">GMB LUX</p></div>
<div class="container-1">
     <h1>New ${request_type} Request</h1>
    <div class="container"> 
      <p>${message}</p>
<div class="divider"></div>
      <p class="highlight">Details</p>
      <p>Name: ${first_name} ${last_name}</p>
<p><span class="highlight" >Email</span>:  ${email}</p>
<p><span class="highlight"> Number</span>: ${number}</p>
<p><span class="highlight" >Service</span>: ${request_type}<p>
<div class="divider"></div>
<div>
<div class="property-image"></div>
<div>
<p class="p2">${title}</p>
<p>${location}</p>
<div class="bbs">
    <div class="pair"><img src="https://gmblux.com/icons/bed.png"/><p>${bedrooms}</p></div>
<div class="pair"><img src="https://gmblux.com/icons/bath.png"//><p>${bathrooms}</p></div>
<div class="pair"><img src="https://gmblux.com/icons/plot.png"//><p>${size}</p></div>
</div>
<p class="p2 price">GH₵${formattedPrice}</p>
</div>
</div>
    </div>
<a href="https://gmblux.com/" target="_blank">www.gmblux.com</a>
<p>Copyright© 2025 GMBRealEstate. All rights reserved.</p>
<div class="socials">
    <a href="https://www.instagram.com/gmb_realestate_ghana?igsh=eGt3dmE2czk3NXZ1" target="_blank"><img src="https://gmblux.com/icons/instagram.png"/></a>
    <a href="https://www.tiktok.com/@gmb_realestateghana?_t=ZM-90xAQSLGjRg&_r=1" target="_blank"><img src="https://gmblux.com/icons/tiktok.png"/></a>
    <a href="https://www.facebook.com/share/1LfGperuUu/?mibextid=wwXIfr" target="_blank"><img src="https://gmblux.com/icons/fb.png"/></a>
    <a href="https://wa.me/233553944428?" target="_blank"><img src="https://gmblux.com/icons/whatsapp.png"/></a>
    <a href="" target="_blank"><img src="https://gmblux.com/icons/youtube.png"/></a>
</div>
</div>
  </body>
</html>`;
}
