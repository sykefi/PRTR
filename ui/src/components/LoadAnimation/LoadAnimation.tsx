import styled, { keyframes, css } from 'styled-components'
import { LoadingIcon } from './LoadingIcon'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  svg {
    display: block;
    animation: ${spin} 0.9s linear infinite;
  }
`

const StyledLoadingIcon = styled(LoadingIcon)<{ sizePx?: number }>`
  ${props =>
    props.sizePx &&
    css<{ sizePx?: number }>`
      height: ${props.sizePx || '50'}px;
      width: auto;
    `}
`

export const LoadAnimation = ({
  sizePx,
  color
}: {
  sizePx: number
  color?: string
}) => {
  return (
    <Spinner>
      <StyledLoadingIcon
        sizePx={sizePx}
        color={color || 'var(--chakra-colors-blue-600)'}
      />
    </Spinner>
  )
}

const SolidLoadAnimationWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const SolidLoadAnimation = ({
  sizePx,
  color
}: {
  sizePx: number
  color?: string
}) => {
  return (
    <SolidLoadAnimationWrapper>
      <LoadAnimation sizePx={sizePx} color={color} />
    </SolidLoadAnimationWrapper>
  )
}
