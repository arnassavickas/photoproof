import React, { useEffect, useState } from 'react';
import { Collection, Photo } from '../types';
import { getCollections } from '../firebase';

const CollectionList: React.FC = () => {
  const [collections, setCollections] = useState<Collection[] | null>(null);

  useEffect(() => {
    getCollections().then((data) => setCollections(data));
  }, []);

  const selectedPhotos = (photos: Photo[]) => {
    return photos.filter((photo) => photo.selected).length;
  };

  if (collections === null) {
    return <div>loading...</div>;
  } else {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>thumbnail</th>
              <th>name</th>
              <th>status</th>
              <th>selected/all photos</th>
              <th>view</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection, index) => {
              return (
                <tr key={collection.title + index}>
                  <td>
                    <img
                      src={collection.photos[0].cloudUrl}
                      alt='first collection img'
                    />
                  </td>
                  <td>{collection.title}</td>
                  <td>{collection.status}</td>
                  <td>
                    {selectedPhotos(collection.photos)}/
                    {collection.photos.length}
                  </td>
                  <td>
                    <button>view</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
};

export default CollectionList;
