import React from 'react';
import styles from './styles.module.scss';
import { PhotoTableProps } from '../../../types';
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

import StarBorderIcon from '@material-ui/icons/StarBorder';

import ImageLoader from '../../ImageLoader/ImageLoader';

const PhotoTable: React.FC<PhotoTableProps> = ({
  collection,
  filteredPhotos,
  selected,
  setSelected,
  setPhotoIndex,
  setLightboxOpen,
}) => {
  const openLightbox = (index: number) => (event: any) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && filteredPhotos) {
      const newSelecteds = filteredPhotos.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  return (
    <TableContainer>
      <Table size='small'>
        <TableHead>
          <TableRow>
            {collection.status === 'editing' ? (
              <TableCell padding='checkbox'>
                <Checkbox
                  indeterminate={
                    selected.length > 0 &&
                    selected.length < filteredPhotos.length
                  }
                  checked={
                    filteredPhotos.length > 0 &&
                    selected.length === filteredPhotos.length
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
            ) : null}
            <TableCell width='5%'>no.</TableCell>
            <TableCell width='10%'>thumbnail</TableCell>
            <TableCell width='30%'>filename</TableCell>
            <TableCell padding='checkbox'></TableCell>
            <TableCell>comment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPhotos.map((photo, index) => (
            <TableRow
              key={photo.id}
              selected={isSelected(photo.id)}
              hover={true}
            >
              {collection.status === 'editing' ? (
                <TableCell
                  data-testid='checkbox'
                  padding='checkbox'
                  onClick={(event) => handleClick(event, photo.id)}
                >
                  <Checkbox checked={isSelected(photo.id)} />
                </TableCell>
              ) : null}
              <TableCell>{photo.index}.</TableCell>
              <TableCell padding='none'>
                <ImageLoader photo={photo} width={150} height={100}>
                  <picture>
                    <source srcSet={photo.thumbnailWebp} type='image/webp' />
                    <img
                      src={photo.thumbnail}
                      alt={collection.title}
                      className={styles.thumbnail}
                      onClick={openLightbox(index)}
                    />
                  </picture>
                </ImageLoader>
              </TableCell>
              <TableCell>{photo.filename}</TableCell>
              <TableCell padding='checkbox'>
                {photo.selected ? (
                  <StarBorderIcon data-testid='selected' />
                ) : null}
              </TableCell>
              <TableCell data-testid='comment'>{photo.comment}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PhotoTable;
