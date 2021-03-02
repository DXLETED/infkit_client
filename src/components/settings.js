import React, { useMemo } from 'react'
import { MultiSwitch } from './multiSwitch'
import { ObjectEdit } from './objectEdit'
import { Select } from './select'
import { Switch } from './switch'
import { useSelector } from 'react-redux'
import { settingsApi } from '../api'
import { Row } from './row'
import { Category } from './Category'
import { DashboardContainer } from './dashboard/Container'
import { MLabel } from './mlabel'
import { Input } from './input'
import { Text } from './Text'
import { Card } from './card'
import { Container } from './container'
import { colors } from './colorlist'
import { EdgedButton } from './button'
import { MessageVisualizer } from './MessageVisualizer'
import { Label } from './label'

export const Settings = ({path}) => {
  const state = useSelector(s => s.guild.settings),
        id = useSelector(s => s.guild.id),
        cardColors = useSelector(s => s.guild.plugins.levels.card.colors),
        api = useMemo(() => settingsApi, []),
        messages = {
          skip: [
            <>
              <MessageVisualizer msg={{content: '`skip'}} w100 />
              <MessageVisualizer msg={{embed: {
                description: '**Skipped**',
                color: '#7eb354',
                footer: {text: state.border && '________________________________________'
              }}}} bot w100 m />
            </>,
            <>
              <MessageVisualizer msg={{content: '`skip'}} w100 />
              <MessageVisualizer msg={{content: '```yaml\nSkipped\n```'}} bot w100 m />
            </>,
            <MessageVisualizer msg={{content: '`skip'}} reacts={[{e: '<:done:732979459724017800>', count: 1}]} w100 m />
          ],
          clear: [
            <>
              <MessageVisualizer msg={{content: '`clear 10'}} w100 />
              <MessageVisualizer msg={{embed: {
                description: '**Cleared 10 messages**',
                color: '#547ab3',
                footer: {text: state.border && '________________________________________'
              }}}} bot w100 m />
            </>,
            <>
              <MessageVisualizer msg={{content: '`clear 10'}} w100 />
              <MessageVisualizer msg={{content: '```yaml\nCleared 10 messages\n```'}} bot w100 m />
            </>,
            <>
              <MessageVisualizer msg={{content: '`clear 10'}} w100 />
              <MessageVisualizer msg={{embed: {
                description: '**Cleared 10 messages**',
                color: '#547ab3',
                footer: {text: state.border && '________________________________________'
              }}}} bot w100 m />
            </>
          ]
        }
  return (
    <DashboardContainer k="settings" title="Settings" className={"settings"} icon="/static/img/settings.png" deps={[state]} p {...{path}}>
      <Category title="General">
        <Row elements={[
          <MultiSwitch label="Perfix" type="string" options={['`', '/', '!', '~', '@', '>']} selected={state.prefix} set={api.prefix} limit={2} custom />,
          <Select label="Language" type="options" selected={state.language} dropdown={['English', 'Russian']} options={['en', 'ru']} set={api.setLanguage} />
        ]} m />
        <ObjectEdit label="Admin roles" type="roles" data={state.admRoles} default="Only administrators by default"
          add={api.admRoles.add}
          delete={api.admRoles.del} m />
      </Category>
      <Category title="Personalization">
        <Row elements={[
          <>
            <MLabel d="Message style" m />
            <MultiSwitch options={['Embed', 'Embed/Markdown', 'Embed/Emoji']} selected={{o: state.responseDesign}} set={api.set.responseDesign} m />
            {messages.skip[state.responseDesign]}
            {messages.clear[state.responseDesign]}
            <Switch enabled={state.border} set={api.toggle.border} p m>Fixed minimum width (border)</Switch>
          </>,
          <>
            <MLabel d="Log link" m />
            <Text disabled>https://infkit.xyz/log/<Input value={id} fill b m /></Text>
            <MLabel d="Music player link" m />
            <Text disabled>https://infkit.xyz/player/<Input value={id} fill b m /></Text>
            <MLabel d="Rank card" m />
            <Row elements={[
              {width: 0, el: <Container hp2 vp2 bg={colors.discordBg}>
                <Card s={{colors: cardColors}} scale={0.8} />
              </Container>},
              <>
                <div className="fill" />
                <EdgedButton to={`${path}/levels`} compact center>Edit</EdgedButton>
              </>
            ]} m />
            <MLabel d="Error messages" m />
            <Switch enabled={state.nopermRole} set={api.toggle.nopermRole} p m>No rights</Switch>
            <Switch enabled={state.nopermChannel} set={api.toggle.nopermChannel} p m>Wrong channel</Switch>
          </>
        ]} />
      </Category>
    </DashboardContainer>
  )
}