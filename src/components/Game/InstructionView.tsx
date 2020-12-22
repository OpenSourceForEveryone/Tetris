// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { observer } from "mobx-react";
import { Avatar, Card, Flex, Text, Checkbox, FlexItem, Button } from "@fluentui/react-northstar";
import "./game.scss";
import { UxUtils } from "../../utils/UxUtils";
import Tetris from "./Tetris/Tetris";
import { Constants } from "../../utils/Constants";

/**
 * <InstructionView> component for game instruction view
 * @observer decorator on the component this is what tells MobX to rerender the component whenever the data it relies on changes.
 */

@observer
export default class InstructionView extends React.Component<any, any> {
    private boardWidth: number;
    private boardHeight: number;
    constructor(props) {
        super(props);
        this.state = {
            startGame: false,
            dontShowFlagSet: false
        };
        this.startGame = this.startGame.bind(this);
    }
    startGame() {
        this.setState({
            startGame: true
        });
    }
    setLocalStorageFlag() {
        this.setState(prev => {
            return { dontShowFlagSet: !prev.dontShowFlagSet };
        });
    }

    render() {
        if(UxUtils.renderingForMobile()) {

            this.boardHeight = 20;
            this.boardWidth = 12;
        } else {
            this.boardHeight = 20;
            this.boardWidth = 14;
        }

        return (
            this.state.startGame ?
                <Tetris boardWidth={this.boardWidth} boardHeight={this.boardHeight} tabIndex={0} /> :
                <Flex className="body-container instruction" column gap="gap.medium">
                    {this.renderInstruction()}
                    {this.renderFooterSection()}
                </Flex>
        );
    }
     // Helper method to render the Instriuction view
    renderInstruction(): JSX.Element {
        return (
            <div>
                <Card aria-roledescription="gameInstruction" fluid className="instruction-card-background-color">
                    <Card.Header fitted>
                        <Flex gap="gap.small">
                            <Flex column>
                                <Avatar image={Constants.GAME_LOGO_PATH} label="Tetris" name="Evie yundt" size="larger" />
                            </Flex>
                            <Flex column>
                                <Text content={this.props.HowToPlay} weight="bold" size="large" />
                                <Text content={this.props.InstructionContent} className="instruction-content-padding" />
                            </Flex>
                        </Flex>
                    </Card.Header>
                </Card>
                <Checkbox className="checklist-checkbox  checkbox-top-padding"
                    label={this.props.DontShowTheGameInstruction}
                    checked={this.state.dontShowFlagSet}
                    onChange={
                        () => {
                            this.setLocalStorageFlag();
                        }
                    } />
            </div>
        );
    }

    // Helper method to render the footer section
    renderFooterSection(isMobileView?: boolean): JSX.Element {
        let className = isMobileView ? "" : "footer-layout";
        return (
            <Flex className={className} gap={"gap.smaller"}>
                <FlexItem push>
                    <Button
                        primary
                        content={this.props.Play}
                        onClick={() => {
                            this.startGame();
                            UxUtils.setLocalStorge(this.state.dontShowFlagSet);
                        }}>
                    </Button>
                </FlexItem>
            </Flex>
        );
    }
}
