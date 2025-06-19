const footer = `
    <div class="footer-area">
      <div class="content container">
        <div class="footer-col contact-us-col">
          <h3 class="footer-col-header">Contact Us</h3>
          <div class="contact-us">
            <div class="summary">
              Hi, we are always open for cooperation and suggestions, contact us in one of the ways below
            </div>
            <address>
              <div class="address-type footer-col-header">Phone Number</div>
              <div class="address-value">+1 (800) 060-07-30</div>
            </address>
            <address>
              <div class="address-type footer-col-header">Email Address</div>
              <div class="address-value">us@example.com</div>
            </address>
            <address>
              <div class="address-type footer-col-header">Our Location</div>
              <div class="address-value">
                715 Fake Street, New York<br />
                10012 USA
              </div>
            </address>
            <address>
              <div class="address-type footer-col-header">Working Hours</div>
              <div class="address-value">Mon-Sat 10:00am - 07:00pm</div>
            </address>
          </div>
        </div>
        
        <div class="footer-col newsletter-col">
          <h3 class="footer-col-header">Newsletter</h3>
          <div class="newsletter">
            <form action="#">
              <div class="form-description">
                Enter your email address below to subscribe to our newsletter and keep up to date with discounts and
                special offers
              </div>
              <input type="text" id="email-input" name="email" placeholder="user@example.com" />
              <input type="submit" value="Subscribe" />
            </form>
            <ul class="social-media-links">
              <div class="description">Follow us on social media networks</div>
              <li>
                <a href="https://www.facebook.com" target="_blank">
                  <i class="icon icon-facebook fa-brands fa-facebook-f"></i>
                </a>
              </li>
              <li>
                <a href="https://www.twitter.com" target="_blank">
                  <i class="icon icon-twitter fa-brands fa-twitter"></i>
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com" target="_blank">
                  <i class="icon icon-youtube fa-brands fa-youtube"></i>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com" target="_blank">
                  <i class="icon icon-instagram fa-brands fa-instagram"></i>
                </a>
              </li>
              <li>
                <a href="#" target="_blank">
                  <i class="icon icon-rss fa-solid fa-rss"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <div class="content container">
        <span>Powered By <a href="#">Tech</a> - Designed by <a href="#">Mohamed Raheem</a></span>
        <span>
          <img src="ecom/img/visa.jpg" alt="payment-method-visa" loading="lazy" />
          <img src="ecom/img/paypal.png" alt="payment-method-paypal" loading="lazy" />
          <img src="ecom/img/mastercard.png" alt="payment-method-mastercard" loading="lazy" />
          <img src="ecom/img/westernunion.webp" alt="payment-method-westernunion" loading="lazy" />
        </span>
      </div>
    </footer>
    <span class="scroll-to-top">
      <i class="fa-solid fa-chevron-up"></i>
    </span>`;

document.body.insertAdjacentHTML("beforeend", footer);
