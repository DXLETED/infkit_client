import React from 'react'
import { useLayout } from '../../hooks/layout.hook'
import { Card } from '../card'
import { ColorPicker } from '../colorPicker'
import { Row } from '../row'
import { Row2 } from '../Row2'

export const CardCustomization = ({state, api}) => {
  const layout = useLayout()
  return <Row2 els={[
    [<div className="card-wr">
      <div className="card">
        <Card s={{colors: state.colors}} />
      </div>
    </div>, {flex: 3}],
    <>
      <ColorPicker label="Text #1" c={state.colors.text1} set={api.colors.set.text1} reset="#FFFFFF" m />
      <ColorPicker label="Text #2" c={state.colors.text2} set={api.colors.set.text2} reset="#939393" m />
      <ColorPicker label="Text #3" c={state.colors.text3} set={api.colors.set.text3} reset="#FFFFFF" m />
      <ColorPicker label="Text #4" c={state.colors.text4} set={api.colors.set.text4} reset="#939393" />
    </>,
    <>
      <ColorPicker label="Background" c={state.colors.bg} set={api.colors.set.bg} reset="#202124" m />
      <ColorPicker label="Name background" c={state.colors.bgname} set={api.colors.set.bgname} reset="#141517" m />
      <ColorPicker label="XP" c={state.colors.xp} set={api.colors.set.xp} reset="#FFFFFF" m />
      <ColorPicker label="XP background" c={state.colors.bgxp} set={api.colors.set.bgxp} reset="#535353" />
    </>
  ]} column={layout.ap1} />
}