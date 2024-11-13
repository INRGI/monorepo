import { Controller, Get, Param } from '@nestjs/common';
import { MondayApiService } from './monday-api.service';

@Controller('monday')
export class MondayApiController {
  constructor(private readonly mondayService: MondayApiService) {}

  @Get('data/:productName/:domainName')
  async getData(
    @Param('productName') productName: string,
    @Param('domainName') domainName: string
  ) {
    return await this.mondayService.fecthDataFromTwoTables(
      productName,
      domainName
    );
  }

  @Get('can-send/:productName/:domainName')
  async canSend(
    @Param('productName') productName: string,
    @Param('domainName') domainName: string
  ) {
    return await this.mondayService.checkIfDomainCanSendProduct(
      productName,
      domainName
    );
  }

  @Get('product/:productName')
  async getProduct(@Param('productName') product: string) {
    return await this.mondayService.findProductByName(product);
  }

  @Get('domain/:domainName')
  async getDomainInfo(@Param('domainName') domainName: string) {
    return await this.mondayService.findDomainByName(domainName);
  }

  @Get('product-status/:productName')
  async getProductStatus(@Param('productName') product: string) {
    return await this.mondayService.fetchProductStatus(product);
  }

  @Get('product-sending/:productName')
  async getProductSending(@Param('productName') product: string) {
    return await this.mondayService.fetchProductDomainSending(product);
  }
}
