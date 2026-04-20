import { test, expect } from '@playwright/test';

// es end to end porque revisa todo el flujo del login NO del componente login
// Ejemplo
// - luego del login exitoso puedo revisar el dashboard y ver que sea del usuario logeado
// - puedo revisar otros pasos intermedios del login
// No solo es el flujo funcional del componente login es del flujo del login

// Si fuera functional login seria solo y solo login componente 
// el flujo login podria ser
/**
 * - te logeas
 * - aparece un popup de documentos pendientes
 * - aparece tu nombre de usuario en el dashboard
 */

test('flujo completo de login exitoso', async ({ page }) => {
  // mockear la api de login para caso exitoso
  await page.route('**/api/login', async (route) => {
    // peticion a esta ruta
    const requestBody = await route.request().postDataJSON(); // capturo el body de la peticion

    if (
      requestBody.email == 'user@example.com' &&
      requestBody.password == 'password123'
    ) {
      // si las credenciales con estas, todo bien y responde lo siguiente
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    } else {
      // si las credenciales son otras, la respuesta es esta
      await route.fulfill({
        status: 401,
        body: JSON.stringify({ message: 'Invalid email or password' }),
      });
    }
  });

  // Iniciar sesion
  await page.goto('http://localhost:4200');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Verificar la redireccion
  await expect(page).toHaveURL('http://localhost:4200/dashboard');
});

test('flujo completo de login fallido', async ({ page }) => {
  // mockear la api de login para caso exitoso
  await page.route('**/api/login', async (route) => {
    // peticion a esta ruta
    const requestBody = await route.request().postDataJSON(); // capturo el body de la peticion

    if (
      requestBody.email == 'user@example.com' &&
      requestBody.password == 'password123'
    ) {
      // si las credenciales con estas, todo bien y responde lo siguiente
      route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    } else {
      // si las credenciales son otras, la respuesta es esta
      await route.fulfill({
        status: 401,
        body: JSON.stringify({ message: 'Invalid email or password' }),
      });
    }
  });

  // Iniciar sesion
  await page.goto('http://localhost:4200');
  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'pass');
  await page.click('button[type="submit"]');

  // Verificar mensaje de error
  const errorMessage = page.locator('text=Invalid email or password');
  await expect(errorMessage).toBeVisible();
});
