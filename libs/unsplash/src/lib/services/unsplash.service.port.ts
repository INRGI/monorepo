export interface UnsplashServicePort {
  getRandomPhoto(): Promise<any>;
  listPhotos(): Promise<any>;
  searchPhotoByKeyword(keyword: string): Promise<any>;
  getPhotoById(id: string): Promise<any>;
}
