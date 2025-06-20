const nav = `
    <nav>
      <div class="container">
        <div class="header">
          <a href="/ecom" class="logo">
            <h1>Web<span class="highlight">M</span>art</h1>
          </a>
          <form class="search-form" method="get">
            <input type="text" placeholder="Search by name or brand" name="query" id="search" />
            <button type="submit">Search</button>
          </form>
          <a href="cart.html" class="cart-button cart-menu-icon">
            <img src="../ecom/img/cart.png" alt="cart" class="cart-menu-img" />
            <span class="alert"></span>
          </a>
          <a href="profile.html" class="profile">
            <img class="avatar user-avatar" src="../ecom/img/avatar.png" alt="profile-picture" />
          </a>
        </div>
      </div>
    </nav>`;

document.body.insertAdjacentHTML("afterbegin", nav);
