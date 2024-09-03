import React from 'react';
import { Background, LoadingText } from './Styles';
import Spinner from '../assets/Spinner.gif';

function Loading() {
    return (
            <Background>
                <img src={Spinner} alt="로딩 중" width="5%" />
                Loading
            </Background>
        
    );
}

export default Loading;