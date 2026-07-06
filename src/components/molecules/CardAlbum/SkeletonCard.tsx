import React, { memo } from 'react'
import styled from 'styled-components'

const SkeletonContainer = styled.div`
  width: 19em;
  margin: 0em 1.5em 3em;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SkeletonImage = styled.div`
  background: #e0e0e0;
  width: 200px;
  height: 200px;
  margin-bottom: 0.5em;
`

const SkeletonText = styled.div`
  background: #e0e0e0;
  height: 1em;
  width: 16em;
  margin-bottom: 0.5em;
`

const SkeletonButtons = styled.div`
  display: flex;
  margin-top: 0.5em;
  justify-content: center;
  width: 100%;
`

const SkeletonButton = styled.div`
  background: #e0e0e0;
  width: 3em;
  height: 2em;

  &:first-child {
    border-radius: 5px 0 0 5px;
  }

  &:last-child {
    border-radius: 0 5px 5px 0;
  }
`

const SkeletonCard = memo(() => {
  return (
    <SkeletonContainer>
      <SkeletonImage />
      <div>
        <SkeletonText />
        <SkeletonButtons>
          <SkeletonButton />
          <SkeletonButton />
        </SkeletonButtons>
      </div>
    </SkeletonContainer>
  )
})

export default SkeletonCard
