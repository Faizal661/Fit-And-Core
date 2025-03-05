import "reflect-metadata";
import { container } from "tsyringe";

import { IAuthenticationController } from '../controllers/Interface/IAuthenticationController'
import AuthenticationController from "../controllers/Implementation/authentication.controller";
import { IAuthenticationService } from '../services/Interface/IAuthenticationService';
import AuthenticationService from '../services/Implementation/authentication.service';
import { IAuthenticationRepository } from "../repositories/Interface/IAuthenticationRepository";
import { AuthenticationRepository } from "../repositories/Implementation/authentication.repository";


// Controllers
container.register<IAuthenticationController>('AuthenticationController', { useClass: AuthenticationController });


// Services
container.register<IAuthenticationService>('AuthenticationService', { useClass: AuthenticationService });


// Repositories
container.register<IAuthenticationRepository>('AuthenticationRepository',{useClass: AuthenticationRepository})



// // Repositories
// container.registerSingleton<IAuthenticationRepository>('AuthenticationRepository',AuthenticationRepository)


// // Services 
// container.registerSingleton<IAuthenticationService>('AuthenticationService',  AuthenticationService); 


// // Controllers
// container.registerSingleton<IAuthenticationController>("AuthenticationController",AuthenticationController);
