import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController; // intercepta peticiones

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        AuthService,
      ],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify(); // verifica que no haya peticiones pendientes
  });

  it('deberia hacer login correctamente', async () => {
    // given
    const mockResponse = { token: 'fake-jwt-response' };

    // when
    const login$ = service.login('user@gmail.com', 'password123');
    const loginPromise = firstValueFrom(login$);

    // esperamos que la llamada haya sido a /api/login
    const req = httpTesting.expectOne('/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'user@gmail.com',
      password: 'password123',
    });

    req.flush(mockResponse); // simulamos respuesta exitosa del back

    // then
    expect(await loginPromise).toEqual(mockResponse);
  });
});
