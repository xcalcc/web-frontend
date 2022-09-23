import React from 'react';
import Skeleton from 'react-loading-skeleton';
import './style.scss';

const SkeletonHolder = props => (<Skeleton width="80%" {...props} />);

export default SkeletonHolder;
