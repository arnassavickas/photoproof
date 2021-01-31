import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateNewCollection } from '../firebase';
import { useForm, Controller } from 'react-hook-form';

type Inputs = {
  files: FileList;
  title: string;
  minSelectRequired: boolean;
  minSelectGoal: number;
  maxSelectRequired: boolean;
  maxSelectGoal: number;
  allowComments: boolean;
};

const NewCollection: React.FC = () => {
  //const [files, setFiles] = useState<FileList | null>(null);
  const [minSelect, setMinSelect] = useState({ required: false, goal: 0 });
  const [maxSelect, setMaxSelect] = useState({ required: false, goal: 0 });
  //const [title, setTitle] = useState('');
  //const [allowComments, setAllowComments] = useState(false);

  const { register, handleSubmit, watch, errors, getValues } = useForm<Inputs>({
    mode: 'onChange',
  });

  const minToggle = watch('minSelectRequired');
  const maxToggle = watch('maxSelectRequired');

  const onSubmit = (data: Inputs) => {
    console.log(data);
    /* generateNewCollection(
      {
        title: data.title,
        minSelect: {
          required: data.minSelectRequired,
          goal: data.minSelectGoal,
        },
        maxSelect: {
          required: data.maxSelectRequired,
          goal: data.maxSelectGoal,
        },
        allowComments: data.allowComments,
      },
      data.files
    ); */
  };

  return (
    <div>
      <Link to='/dashboard'>
        <button>cancel</button>
      </Link>
      <h2>new collection</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          title
          <input
            name='title'
            ref={register({ required: true, maxLength: 50 })}
          />
        </div>
        <div>
          upload photos
          <input
            name='files'
            type='file'
            ref={register({ required: true })}
            multiple
          />
        </div>
        <div>
          add watermark
          <input type='checkbox' />
        </div>
        <div>
          allow comments
          <input name='allowComments' type='checkbox' ref={register} />
        </div>
        <div>selection goals</div>
        <div>
          minimum:
          <input name='minSelectRequired' type='checkbox' ref={register} />
          <div style={{ display: minToggle ? 'inline' : 'none' }}>
            <input
              name='minSelectGoal'
              type='number'
              min='1'
              ref={register({
                min: '1',
                max: '999',
                valueAsNumber: true,
                validate: {
                  lowerThanMax: (value) =>
                    !getValues('maxSelectRequired') ||
                    getValues('maxSelectGoal') >= value,
                },
              })}
            />
            {errors.minSelectGoal && (
              <span>Must be higher than maximum value</span>
            )}
          </div>
        </div>
        <div>
          maximum:
          <input name='maxSelectRequired' type='checkbox' ref={register} />
          <div style={{ display: maxToggle ? 'inline' : 'none' }}>
            <input
              name='maxSelectGoal'
              type='number'
              min='1'
              ref={register({
                min: '1',
                max: '999',
                valueAsNumber: true,
                validate: {
                  higherThanMin: (value) => getValues('minSelectGoal') <= value,
                },
              })}
            />
            {errors.maxSelectGoal && (
              <span>Must be higher than minimum value</span>
            )}
          </div>
        </div>
        <div>
          <button type='submit'>save</button>
        </div>
      </form>
    </div>
  );
};

export default NewCollection;
