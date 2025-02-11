import { test, expect } from 'playwright-test-coverage';

test('purchase with login', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'd@jwt.com', password: 'a' };
    const loginRes = { user: { id: 3, name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderReq = {
      items: [
        { menuId: 1, description: 'Veggie', price: 0.0038 },
        { menuId: 2, description: 'Pepperoni', price: 0.0042 },
      ],
      storeId: '4',
      franchiseId: 2,
    };
    const orderRes = {
      order: {
        items: [
          { menuId: 1, description: 'Veggie', price: 0.0038 },
          { menuId: 2, description: 'Pepperoni', price: 0.0042 },
        ],
        storeId: '4',
        franchiseId: 2,
        id: 23,
      },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(orderReq);
    await route.fulfill({ json: orderRes });
  });

  await page.goto('http://localhost:5173');

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});


test('about and history pages', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByRole('main')).toContainText('The secret sauce');
  await expect(page.getByRole('main')).toContainText('Our talented employees at JWT Pizza are true artisans. They pour their heart and soul into every pizza they create, striving for perfection in every aspect. From hand-stretching the dough to carefully layering the toppings, they take pride in their work and are constantly seeking ways to elevate the pizza-making process. Their creativity and expertise shine through in every slice, resulting in a pizza that is not only delicious but also a work of art. We are grateful for our dedicated team and their unwavering commitment to delivering the most flavorful and satisfying pizzas to our valued customers.');
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');
  await expect(page.getByRole('main')).toContainText('However, it was the Romans who truly popularized pizza-like dishes. They would top their flatbreads with various ingredients such as cheese, honey, and bay leaves.');
});


test('register', async ({ page }) => {

  await page.route('*/**/api/auth', async (route) => {
    const requestMethod = route.request().method();

    if (requestMethod === 'POST') {
      // Mock response for registration
      const regResult = {
        "user": {
          "name": "testR@test.com",
          "email": "r@test.com",
          "roles": [
            {
              "role": "diner"
            }
          ],
          "id": 512
        },
        "token": "123"
      };
      await route.fulfill({ json: regResult });
    } else if (requestMethod === 'DELETE') {
      // Mock response for logout
      const logoutResult = {
        "message": "logout successful"
      };
      await route.fulfill({ json: logoutResult });
    } else {
      // Allow other requests to proceed unmocked
      await route.continue();
    }
  });
  
  // register
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Register' }).click();
  await expect(page.getByRole('heading')).toContainText('Welcome to the party');
  await page.getByRole('textbox', { name: 'Full name' }).fill('testR@test.com');
  await page.getByRole('textbox', { name: 'Full name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Email address' }).fill('r@test.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('r');
  await expect(page.getByRole('textbox', { name: 'Full name' })).toHaveValue('testR@test.com');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await expect(page.getByRole('textbox', { name: 'Email address' })).toHaveValue('r@test.com');
  await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('r');
  await page.getByRole('button', { name: 'Register' }).click();

  // after register
  await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');

  // logout
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');

});

// test franchisee see franchises
test('franchise dashboard / create store', async ({ page }) => {
  
  // mock out login
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = {"email": "f@jwt.com", "password": "franchisee"};
    const loginRes = { user: { id: 3, name: "pizza franchisee", email: "f@jwt.com", roles: [{ role: "diner" }, { objectId: 1, role: "franchisee" }] }, token: "12345" };

    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  // mock out get franchises
  await page.route('*/**/api/franchise/3', async (route) => {
    expect(route.request().method()).toBe('GET');
    
    const headers = route.request().headers();
    expect(headers['authorization']).toBe('Bearer 12345');
    let franchDashboardRes = [
      {
        "id": 1, "name": "pizzaPocket",
        "admins": [
          {"id": 3, "name": "pizza franchisee", "email": "f@jwt.com"}],
        "stores": [
          { "id": 1, "name": "SLC", "totalRevenue": 6.1625 },
          { "id": 2, "name": "The 'Couve", "totalRevenue": 0.0118 },
          { "id": 18, "name": "jtown", "totalRevenue": 0 },
          { "id": 19, "name": "jtown", "totalRevenue": 0 },
          { "id": 20, "name": "jtown", "totalRevenue": 0 },
          { "id": 21, "name": "jtown", "totalRevenue": 0 },
          { "id": 22, "name": "jtown", "totalRevenue": 0 },
          { "id": 23, "name": "jtown", "totalRevenue": 0 }
        ]
      }
    ]
    await route.fulfill({ json: franchDashboardRes });
  });

  // mock out create store
  await page.route('*/**/api/franchise/1/store', async (route) => {
    expect(route.request().method()).toBe('POST');
    const headers = route.request().headers();
    expect(headers['authorization']).toBe('Bearer 12345');
    let storeReq = {"id": "", "name": "nyc"}
    let storeRes = {"id": 40, "franchiseId": 1, "name": "nyc"}
    expect(route.request().postDataJSON()).toMatchObject(storeReq);
    await route.fulfill({ json: storeRes });

  });

  // Login
   await page.goto('http://localhost:5173/');
   await page.getByRole('link', { name: 'Login' }).click();
   await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
   await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
   await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
   await expect(page.getByRole('textbox', { name: 'Email address' })).toHaveValue('f@jwt.com');
   await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('franchisee');
   await page.getByRole('button', { name: 'Login' }).click();

   // Assert back at home page
   await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');

   // click Franchise
   await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
   await expect(page.getByRole('heading')).toContainText('pizzaPocket');
   await expect(page.locator('tbody')).toContainText('SLC');

  //  Create Store
   await page.getByRole('button', { name: 'Create store' }).click();
   await page.getByRole('textbox', { name: 'store name' }).click();
   await page.getByRole('textbox', { name: 'store name' }).fill('nyc');
   await expect(page.getByRole('heading')).toContainText('Create store');
   await expect(page.getByRole('textbox', { name: 'store name' })).toHaveValue('nyc');
   await page.getByRole('button', { name: 'Create' }).click();

});

// test view admin dash
test('admin dashboard, create/remove store', async ({ page }) => {
  // mockout login
  await page.route('*/**/api/auth', async (route) => {
    console.log("Authorizing.................................")
    const loginReq = { email: "a@jwt.com", password: "admin" };
    const loginRes = { user: { id: 1, name: "常用名字", email: "a@jwt.com", roles: [{ role: "admin" }, { objectId: 44, role: "franchisee" }, { objectId: 47, role: "franchisee" }] }, token: "12345" };

    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  // mock out get/create franchise
  await page.route('*/**/api/franchise', async (route) => {
    const method = route.request().method();
    const headers = route.request().headers();
    expect(headers['authorization']).toBe('Bearer 12345');
    console.log("This is the header: ", headers)
    console.log("This is the method: ", method)
    if (method === 'GET') {
      const adminDashRes = [
        { id: 15, name: "0gfzvcttlh", admins: [{ id: 381, name: "ibaoywcmag", email: "ibaoywcmag@admin.com" }], stores: [] },
        { id: 16, name: "39l6o8qyra", admins: [{ id: 383, name: "vkh0hnl5ov", email: "vkh0hnl5ov@admin.com" }], stores: [{ id: 6, name: "8g7h0zwfiv", totalRevenue: 0 }] },
        { id: 44, name: "bpb", admins: [{ id: 1, name: "常用名字", email: "a@jwt.com" }], stores: [] }
      ];
      await route.fulfill({ json: adminDashRes });
    } else if (method === 'POST') {
      const franchReq = { stores: [], id: "", name: "ccc", admins: [{ email: "a@jwt.com" }] };
      const franchRes = { stores: [], id: 51, name: "ccc", admins: [{ email: "a@jwt.com", id: 1, name: "常用名字" }] };
      expect(route.request().postDataJSON()).toMatchObject(franchReq);
      await route.fulfill({ json: franchRes });
    } 

  });

  // mockout delete store
  await page.route('*/**/api/franchise/44', async (route) => {
    expect(route.request().method()).toBe('DELETE');
    const headers = route.request().headers();
    expect(headers['authorization']).toBe('Bearer 12345');
    const delRes = {"message": "franchise deleted"}
    await route.fulfill({ json: delRes });
  });
  
  // login
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await expect(page.getByRole('heading')).toContainText('Welcome back');
  await expect(page.getByRole('textbox', { name: 'Email address' })).toHaveValue('a@jwt.com');
  await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  // Admin Dashboard
  await expect(page.getByRole('heading')).toContainText('The web\'s best pizza');
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('table')).toContainText('0gfzvcttlh');

  // Create Franchise
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('ccc');
  await page.getByRole('textbox', { name: 'franchise name' }).press('Tab');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('a@jwt.com');
  await expect(page.getByRole('heading')).toContainText('Create franchise');
  await expect(page.getByRole('textbox', { name: 'franchise name' })).toHaveValue('ccc');
  await expect(page.getByRole('textbox', { name: 'franchisee admin email' })).toHaveValue('a@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();

  // Close Franchise
  await page.getByRole('row', { name: 'bpb 常用名字 Close' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();

});
