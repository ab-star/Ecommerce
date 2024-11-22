import { Container } from 'inversify';
// import { ProductService } from './services/product.service';
import { SalesOrderService } from './services/salesOrder.service';
// import { ProductRepository } from './repositories/product.repository';
import { SalesOrderRepository } from './repositories/salesOrder.repository';
import { TYPES } from './types';
import { MasterProductService } from './services/masterProduct.service';
import { MasterProductRepository } from './repositories/masterProduct.repository';
import { IntegrationService } from './services/integration.service';
import { IntegrationRepository } from './repositories/integration.repository';

// Create a new Inversify container
const container = new Container();

// Bind services to their respective symbols
// container.bind<ProductService>(TYPES.ProductService).to(ProductService);
container.bind<SalesOrderService>(TYPES.SalesOrderService).to(SalesOrderService);
container.bind<MasterProductService>(TYPES.MasterProductService).to(MasterProductService);
container.bind<IntegrationService>(TYPES.IntegrationService).to(IntegrationService);

// Bind repositories to their respective symbols
// container.bind<ProductRepository>(TYPES.ProductRepository).to(ProductRepository);
container.bind<SalesOrderRepository>(TYPES.SalesOrderRepository).to(SalesOrderRepository);
container.bind<MasterProductRepository>(TYPES.MasterProductRepository).to(MasterProductRepository);
container.bind<IntegrationRepository>(TYPES.IntegrationRepository).to(IntegrationRepository);


export { container };
