import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateNewCollection } from '../firebase';

const NewCollection: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [minSelect, setMinSelect] = useState({ required: false, goal: 0 });
  const [maxSelect, setMaxSelect] = useState({ required: false, goal: 0 });
  const [title, setTitle] = useState('');
  const [allowComments, setAllowComments] = useState(false);

  const handleFileSelect = (e: { target: HTMLInputElement }) => {
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleAllowCommentsChange = () => {
    setAllowComments(!allowComments);
  };
  const toggleMinSelect = () => {
    setMinSelect({
      goal: minSelect.goal > maxSelect.goal ? maxSelect.goal : minSelect.goal,
      required: !minSelect.required,
    });
  };
  const toggleMaxSelect = () => {
    console.log('toggle max');
    setMaxSelect({
      goal: minSelect.goal > maxSelect.goal ? minSelect.goal : maxSelect.goal,
      required: !maxSelect.required,
    });
  };
  const handleMinSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!maxSelect.required) {
      setMinSelect({ ...minSelect, goal: Number(e.target.value) });
    } else if (
      minSelect.goal < maxSelect.goal ||
      minSelect.goal > Number(e.target.value)
    ) {
      setMinSelect({ ...minSelect, goal: Number(e.target.value) });
    }
  };

  const onMinBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) > maxSelect.goal && maxSelect.required) {
      setMinSelect({ ...minSelect, goal: maxSelect.goal });
    }
  };
  const onMaxBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) < minSelect.goal && minSelect.required) {
      setMaxSelect({ ...maxSelect, goal: minSelect.goal });
    }
  };

  const handleMaxSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!minSelect.required) {
      setMaxSelect({ ...maxSelect, goal: Number(e.target.value) });
    } else if (
      minSelect.goal < maxSelect.goal ||
      maxSelect.goal < Number(e.target.value)
    ) {
      setMaxSelect({ ...maxSelect, goal: Number(e.target.value) });
    }
  };

  const handleSave = () => {
    if (files) {
      generateNewCollection(
        {
          title,
          minSelect,
          maxSelect,
          allowComments,
        },
        files
      );
    }
  };

  return (
    <div>
      <Link to='/dashboard'>
        <button>cancel</button>
      </Link>
      <h2>new collection</h2>
      <form>
        <div>
          title<input value={title} onChange={handleTitleChange}></input>
        </div>
        <div>
          upload photos
          <input
            name='file'
            type='file'
            onChange={handleFileSelect}
            multiple
          ></input>
        </div>
        <div>
          add watermark<input type='checkbox'></input>
        </div>
        <div>
          allow comments
          <input type='checkbox' onChange={handleAllowCommentsChange}></input>
        </div>
        <div>selection goals</div>
        <div>
          minimum:
          <input type='checkbox' onChange={toggleMinSelect} />
          <input
            style={{ display: minSelect.required ? 'inline' : 'none' }}
            min='0'
            max='999'
            value={minSelect.goal}
            type='number'
            onChange={handleMinSelect}
            onBlur={onMinBlur}
          ></input>
        </div>
        <div>
          maximum:
          <input type='checkbox' onChange={toggleMaxSelect} />
          <input
            style={{ display: maxSelect.required ? 'inline' : 'none' }}
            min='0'
            max='999'
            value={maxSelect.goal}
            type='number'
            onChange={handleMaxSelect}
            onBlur={onMaxBlur}
          ></input>
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
