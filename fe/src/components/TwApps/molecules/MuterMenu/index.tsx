import React from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/reducers';
import { MyThemeProps, resetButton } from '../../../../modules/styles/theme';
import { mediaQ } from '../../../../modules/styles/media';
const transparent_eye_icon = require('../../../../../img/transparent_eye_icon.svg');

import ToggleMenuButton from '../../atoms/ToggleMenuButton';

const openKeyframes = keyframes`
  0% {
    left: -220px;
  }
  100% {
    left: 0;
  }
`;

const closeKeyframes = keyframes`
  0% {
    left: 0;
  }
  100% {
    left: -220px;
  }
`;

/**
 * ContainerのsyledComponentを生成する
 * 開閉状態を動的に変更し、かつテスト可能にするために関数にする
 * @param {boolean} isOpened メニューの開閉を表すboolean
 */
export const createContainer = (isOpened) => styled.div<any>`
  background-color: ${({ theme }: MyThemeProps<{}>) => theme.colors.basicGray};
  bottom: 0;
  display: flex;
  height: 50px;
  justify-content: space-between;
  padding: 0 50px;
  position: fixed;
  width: 100%;
  ${mediaQ.pc} {
    border-right: solid 1px ${({ theme }: MyThemeProps<{}>) => theme.colors.darkGray};
    display: block;
    height: 100vh;
    padding: 20px;
    position: fixed;
    top: 50px;
    width: 300px;
    animation: ${isOpened ? openKeyframes : closeKeyframes} .3s both;
  }
`;

export const CountButton = styled.button`
  background: url(${transparent_eye_icon}) center center / 35px no-repeat;
  color: ${({ theme }: MyThemeProps<{}>) => theme.colors.iconGray};
  font-size: 1.8rem;
  font-weight: bold;
  padding-top: 7px;
  width: 50px;
  ${resetButton};
  ${mediaQ.pc} {
    background: url(${transparent_eye_icon}) 222px / 35px no-repeat;
    font-size: 2rem;
    margin-top: 30px;
    width: 100%;

    &::before {
      content: 'チラ見ツイート数';
      font-size: 1.125rem;
      font-weight: bold;
      margin-right: 75px;
      vertical-align: 5px;
    }
  }
`;

type Props = {
  isMuterMenuOpened: boolean;
}

const MuterMenu = ({ isMuterMenuOpened }: Props) => {
  const Container = createContainer(isMuterMenuOpened);

  return(
    <Container isOpend={isMuterMenuOpened}>
    <ToggleMenuButton />
      <CountButton>
        <span className="tweets-count">3</span>
      </CountButton>
    </Container>
  )
};

MuterMenu.propTypes = {
  isMuterMenuOpened: PropTypes.bool.isRequired,
};

export default connect(
  (state: RootState) => ({
    isMuterMenuOpened: state.isMuterMenuOpened,
  }),
)(MuterMenu);
