import React from 'react';
import { Link } from 'react-router-dom';

//TODO implement interactive watermark size/angle adjustment
//TODO rethink how to display images on CollectionPage, maybe grid setting is not required

const Settings: React.FC = () => {
  return (
    <div>
      <Link to='/'>
        <button>home</button>
      </Link>
      <h2>settings</h2>
      <form>
        <div>
          grid width<input type='number'></input>
        </div>
        <div>
          upload watermark<input type='file'></input>
        </div>
        <div>
          watermark size, px<input min='0' type='number'></input>
        </div>
        <div>
          watermark angle, deg<input min='0' max='360' type='number'></input>
        </div>
        <div>
          <button>save</button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
