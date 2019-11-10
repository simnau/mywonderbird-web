import styled, { css } from 'styled-components';
import { darken } from 'polished';

import * as colors from '../constants/colors';

const baseButtonStyle = css`
  padding: 4px 8px;
  line-height: 16px;
  font-size: 14px;
  border-radius: 4px;
  outline: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  text-align: center;

  transition: color 100ms linear, background-color 100ms linear,
    border-color 100ms linear;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const outlinePrimaryStyle = css`
  color: ${props => props.color || colors.primary};
  border-color: ${props => props.borderColor || colors.primary};
  text-decoration: none;

  &:hover {
    color: white;
    background-color: ${props => props.color || colors.primary};
  }

  &:active {
    color: white;
    background-color: ${props => darken(0.1, props.color || colors.primary)};
    border-color: ${props => darken(0.1, props.borderColor || colors.primary)};
  }

  &:disabled {
    color: ${props => props.color || colors.primary};
    border-color: ${props => props.borderColor || colors.primary};

    &:hover,
    &:active {
      color: ${props => props.color || colors.primary};
      border-color: ${props => props.borderColor || colors.primary};
    }
  }
`;

const outlineDangerStyle = css`
  color: ${props => props.color || colors.danger};
  border-color: ${props => props.borderColor || colors.danger};

  &:hover {
    color: white;
    background-color: ${props => props.color || colors.danger};
  }

  &:active {
    color: white;
    background-color: ${props => darken(0.1, props.color || colors.danger)};
    border-color: ${props => darken(0.1, props.borderColor || colors.danger)};
  }

  &:disabled {
    color: ${props => props.color || colors.danger};
    border-color: ${props => props.borderColor || colors.danger};

    &:hover,
    &:active {
      color: ${props => props.color || colors.danger};
      border-color: ${props => props.borderColor || colors.danger};
    }
  }
`;

const outlineDefaultStyle = css`
  color: ${props => props.color || 'gray'};
  border-color: ${props => props.borderColor || 'gray'};

  &:hover {
    color: white;
    background-color: ${props => props.color || 'gray'};
  }

  &:active {
    color: white;
    background-color: ${props => darken(0.1, props.color || 'gray')};
    border-color: ${props => darken(0.1, props.borderColor || 'gray')};
  }

  &:disabled {
    color: ${props => props.color || 'gray'};
    border-color: ${props => props.borderColor || 'gray'};

    &:hover,
    &:active {
      color: ${props => props.color || 'gray'};
      border-color: ${props => props.borderColor || 'gray'};
    }
  }
`;

function getOutlineStyleByVariant(variant) {
  switch (variant) {
    case 'primary':
      return outlinePrimaryStyle;
    case 'danger':
      return outlineDangerStyle;
    default:
      return outlineDefaultStyle;
  }
}

export const OutlineButton = styled.button`
  ${baseButtonStyle}
  background-color: transparent;

  border: 2px solid transparent;

  ${props => getOutlineStyleByVariant(props.variant)}

  &:disabled {
    background-color: transparent;

    &:hover,
    &:active {
      background-color: transparent;
    }
  }
`;

const primaryStyle = css`
  background-color: ${props => props.backgroundColor || colors.primary};
  border-color: ${props => props.backgroundColor || colors.primary};

  &:hover {
    background-color: ${props => darken(0.05, props.color || colors.primary)};
    border-color: ${props => darken(0.05, props.color || colors.primary)};
  }

  &:active {
    background-color: ${props => darken(0.2, props.color || colors.primary)};
    border-color: ${props => darken(0.2, props.color || colors.primary)};
  }

  &:disabled {
    background-color: ${props => props.backgroundColor || colors.primary};
    border-color: ${props => props.backgroundColor || colors.primary};

    &:hover,
    &:active {
      background-color: ${props => props.backgroundColor || colors.primary};
      border-color: ${props => props.backgroundColor || colors.primary};
    }
  }
`;

const dangerStyle = css`
  background-color: ${props => props.backgroundColor || colors.danger};
  border-color: ${props => props.backgroundColor || colors.danger};

  &:hover {
    background-color: ${props => darken(0.05, props.color || colors.danger)};
    border-color: ${props => darken(0.05, props.color || colors.danger)};
  }

  &:active {
    background-color: ${props => darken(0.2, props.color || colors.danger)};
    border-color: ${props => darken(0.2, props.color || colors.danger)};
  }

  &:disabled {
    background-color: ${props => props.backgroundColor || colors.danger};
    border-color: ${props => props.backgroundColor || colors.danger};

    &:hover,
    &:active {
      background-color: ${props => props.backgroundColor || colors.danger};
      border-color: ${props => props.backgroundColor || colors.danger};
    }
  }
`;

const defaultStyle = css`
  background-color: ${props => props.backgroundColor || 'gray'};
  border-color: ${props => props.backgroundColor || 'gray'};

  &:hover {
    background-color: ${props => darken(0.05, props.color || 'gray')};
    border-color: ${props => darken(0.05, props.color || 'gray')};
  }

  &:active {
    background-color: ${props => darken(0.2, props.color || 'gray')};
    border-color: ${props => darken(0.2, props.color || 'gray')};
  }

  &:disabled {
    background-color: ${props => props.backgroundColor || 'gray'};
    border-color: ${props => props.backgroundColor || 'gray'};

    &:hover,
    &:active {
      background-color: ${props => props.backgroundColor || 'gray'};
      border-color: ${props => props.backgroundColor || 'gray'};
    }
  }
`;

function getStyleByVariant(variant) {
  switch (variant) {
    case 'primary':
      return primaryStyle;
    case 'danger':
      return dangerStyle;
    default:
      return defaultStyle;
  }
}

export const Button = styled.button`
  ${baseButtonStyle}
  color: ${props => props.color || 'white'};
  border: 2px solid transparent;
  ${props => getStyleByVariant(props.variant)};
`;
