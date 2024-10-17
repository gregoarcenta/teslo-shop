<p style="text-align: center;">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Teslo API

## Ejecutar en entorno de desarrollo
1. Clonar proyecto
2. Instalar dependencias ```pnpm install```
3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```
4. Cambiar las variables de entorno
5. Levantar la base de datos ```docker compose up -d```
6. Ejecutar ```pnpm start:dev```

## Documentación API (Swagger)
```
http://localhost:3000/api
```
## Ejecutar Seed
```
http://localhost:3000/api/seed
```

## Ejecutar Tests
```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
