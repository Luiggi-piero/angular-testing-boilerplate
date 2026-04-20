import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { fireEvent, render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let authServiceMock!: jest.Mocked<AuthService>;

  beforeEach(async () => {
    // antes de cada prueba inicializamos el AuthService
    authServiceMock = {
      login: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    delete (window as any).location;
    window.location = { href: '' } as any;
  });

  it('deberia redirigir al dashboard en login exitoso', async () => {
    // ************GIVEN************
    // cuando se llame a login devolvera un valor.. el token en un observable
    authServiceMock.login.mockReturnValueOnce(of({ token: 'fake-jwt-token' }));

    // renderiza el componente
    await render(LoginComponent, {
      // renderiza con algunas cosas en su interior
      // cuando quieras usar AuthService, realmente usaras authServiceMock
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    });

    // ************WHEN************
    //#region con fireevent
    // escibiendo un valor el input con placeholder Email
    // fireEvent.input(screen.getByPlaceholderText('Email'), {
    //   target: { value: 'user@gmail.com' },
    // });

    // fireEvent.input(screen.getByPlaceholderText('Password'), {
    //   target: { value: 'password123' },
    // });

    // fireEvent.click(screen.getByRole('button'), {
    //   name: /login/i, // expresion regular, el nombre incluye login en su interior
    // });
    //#endregion
    // con user event, es similar a fireEvent
    await userEvent.type(
      screen.getByPlaceholderText('Email'),
      'user@example.com',
    );
    await userEvent.type(
      screen.getByPlaceholderText('Password'),
      'password123',
    ); // tipea este texto en el elemento que tenga el placeholder Password
    await userEvent.click(screen.getByRole('button', { name: /login/i })); // realiza un click en el boton que contenga el texto login

    // ************THEN************
    expect(authServiceMock.login).toHaveBeenCalledWith(
      'user@example.com',
      'password123',
    );
    expect(window.location.href).toBe('/dashboard');
  });

  it('deberia dar un error en login', async () => {
    // ************GIVEN************
    // cuando se llame a login devolvera un error
    authServiceMock.login.mockReturnValueOnce(
      throwError(() => ({ error: { message: 'Invalid email or password' } })),
    );

    // renderiza el componente
    await render(LoginComponent, {
      // renderiza con algunas cosas en su interior
      // cuando quieras usar AuthService, realmente usaras authServiceMock
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    });

    // ************WHEN************
    // con user event, es similar a fireEvent
    await userEvent.type(
      screen.getByPlaceholderText('Email'),
      'user@example.com',
    );
    await userEvent.type(screen.getByPlaceholderText('Password'), 'pass'); // tipea este texto en el elemento que tenga el placeholder Password
    await userEvent.click(screen.getByRole('button', { name: /login/i })); // realiza un click en el boton que contenga el texto login

    // ************THEN************
    expect(authServiceMock.login).toHaveBeenCalledWith(
      'user@example.com',
      'pass',
    );
    const errorMessage = await screen.findByText('Invalid email or password');
    expect(errorMessage).toBeTruthy();
  });
});
