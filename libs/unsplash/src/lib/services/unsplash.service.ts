import { Inject, Injectable, Logger } from '@nestjs/common';
import { UnsplashServicePort } from './unsplash.service.port';
import { UnsplashTokens } from '../unsplash.tokens';
import { UnsplashOptions } from '../interfaces';
import axios from 'axios';

@Injectable()
export class UnsplashService implements UnsplashServicePort {
  private readonly logger = new Logger(UnsplashService.name);

  constructor(
    @Inject(UnsplashTokens.UnsplashModuleOptions)
    private readonly options: UnsplashOptions
  ) {}

  public async getRandomPhoto():Promise<any>{
    const result = await axios.get(`https://api.unsplash.com/photos/random?client_id=${this.options.accessKey}`)
    if(result.data.urls.full){
        return result.data.urls.full;
    }
    return 'Something went wrong';
  };

  public async listPhotos():Promise<any>{
    const result = await axios.get(`https://api.unsplash.com/photos?client_id=${this.options.accessKey}`)
    if(result){
        return result;
    }
    return 'Something went wrong';
  };

  public async searchPhotoByKeyword(keyword: string):Promise<any>{
    const result = await axios.get(`https://api.unsplash.com/search/photos?page=1&query=${keyword}&client_id=${this.options.accessKey}`)
    if(result){
        return result;
    }
    return 'Something went wrong';
  };

  public async getPhotoById(id: string):Promise<any>{
    const result = await axios.get(`https://api.unsplash.com/photo/${id}?client_id=${this.options.accessKey}`)
    if(result){
        return result;
    }
    return 'Something went wrong';
  };
}
