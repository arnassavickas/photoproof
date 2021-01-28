import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateNewCollection } from '../firebase';

const NewCollection: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);

  const handleChange = (e: { target: HTMLInputElement }) => {
    if (!e || !e.target || !e.target.files) {
      return;
    }
    console.log('handlechange');
    if (e.target.files) {
      let files = e.target.files;
      if (files !== null) {
        setFiles(files);
      }
    }
  };

  const handleSave = () => {
    if (files) {
      generateNewCollection(
        {
          title: 'new title',
          minSelect: { required: true, goal: 3 },
          maxSelect: { required: false, goal: 0 },
          allowComments: true,
        },
        files
      );
    }
  };

  return (
    <div>
      <Link to='/'>
        <button>cancel</button>
      </Link>
      <h2>new collection</h2>
      <form>
        <div>
          title<input></input>
        </div>
        <div>
          upload photos
          <input
            name='file'
            type='file'
            onChange={handleChange}
            multiple
          ></input>
        </div>
        <div>
          add watermark<input type='checkbox'></input>
        </div>
        <div>
          allow comments<input type='checkbox'></input>
        </div>
        <div>
          minimum selection<input min='0' type='number'></input>
        </div>
        <div>
          maximum selection<input min='0' type='number'></input>
        </div>
        <div>
          <button type='button' onClick={handleSave}>
            save
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewCollection;
