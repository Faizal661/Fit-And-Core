import { container } from "tsyringe";
import "reflect-metadata";

import { IAuthenticationController } from '../controllers/Interface/IAuthenticationController'
import AuthenticationController from "../controllers/Implementation/authentication.controller";
import { IAuthenticationService } from '../services/Interface/IAuthenticationService';
import AuthenticationService from '../services/Implementation/authentication.service';


// Controllers
container.register<IAuthenticationController>('AuthenticationController', { useClass: AuthenticationController });


// Services
container.register<IAuthenticationService>('AuthenticationService', { useClass: AuthenticationService });
