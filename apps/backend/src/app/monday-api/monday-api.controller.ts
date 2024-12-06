import { Controller, Get, Param } from '@nestjs/common';
import { MondayApiService } from './monday-api.service';

@Controller('monday')
export class MondayApiController {
  constructor(private readonly mondayService: MondayApiService) {}

  @Get('data/:productName/:domainName')
  /**
   * Handles GET requests to fetch the data from the two tables for a specified
   * product and domain.
   * @param productName The name of the product to fetch data for.
   * @param domainName The name of the domain to fetch data for.
   * @returns The data from the two tables as an object with 'product' and 'domain'
   *          properties.
   */
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
  /**
   * Handles GET requests to check if a domain can send a specified product.
   * @param productName The name of the product to check if the domain can send.
   * @param domainName The name of the domain to check if it can send the product.
   * @returns A boolean indicating whether the domain can send the product.
   */
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
  /**
   * Handles GET requests to retrieve the product information for a specified product.
   * @param product The name of the product to fetch information for.
   * @returns The product information as a column value object.
   */
  async getProduct(@Param('productName') product: string) {
    return await this.mondayService.findProductByName(product);
  }

  @Get('domain/:domainName')
  /**
   * Handles GET requests to retrieve the domain information for a specified domain.
   * @param domainName The name of the domain to fetch information for.
   * @returns The domain information as a column value object.
   */
  async getDomainInfo(@Param('domainName') domainName: string) {
    return await this.mondayService.findDomainByName(domainName);
  }

  @Get('product-status/:productName')
  /**
   * Handles GET requests to retrieve the status of a specified product.
   * @param product The name of the product to fetch status for.
   * @returns The product's status as a column value object.
   */
  async getProductStatus(@Param('productName') product: string) {
    return await this.mondayService.fetchProductStatus(product);
  }

  @Get('product-sending/:productName')
/**
 * Handles GET requests to retrieve the domain sending information for a specified product.
 * @param product The name of the product to fetch domain sending information for.
 * @returns The product's domain sending information as a column value object.
 */
  async getProductSending(@Param('productName') product: string) {
    return await this.mondayService.fetchProductDomainSending(product);
  }
}
