import React from 'react';
import { Collection, Photo } from '../types';

const CollectionList: React.FC<{ collections: Collection[] }> = ({
  collections,
}) => {
  const selectedPhotos = (photos: Photo[]) => {
    return photos.filter((photo) => photo.selected).length;
  };

  return (
    <div>
      <table>
        <tr>
          <th>thumbnail</th>
          <th>name</th>
          <th>status</th>
          <th>selected/all photos</th>
          <th>view</th>
        </tr>
{/*         {collections.map((collection) => {
          return (
            <tr key={collection.id}>
              <td>
                <img
                  src={collection.photos[0].cloudUrl}
                  alt='first collection img'
                />
              </td>
              <td>{collection.title}</td>
              <td>{collection.status}</td>
              <td>
                {selectedPhotos(collection.photos)}/{collection.photos.length}
              </td>
              <td>
                <button>view</button>
              </td>
            </tr>
          );
        })} */}
      </table>
    </div>
  );
};

export default CollectionList;
