/** @format */

import React, { Component } from "react";
import { TextInput } from "react-native";
import Styles from "./styles";
import { IsNonEmptyString } from "../../Utils/HelperFunctions";
import AppText from "../AppText/AppText";
import R from "../../Utils/R";
import { SelectedBlue } from "../../Utils/Constants/Color";

/**
 * Props:
 * isNonEmpty
 * hasMimimumLength
 * minimumLength
 * onValidationError
 */

/**
 * Text input wrapper for the app. Applies common styles like border width, border radius,
 * text style and color.
 *
 *  params {boolean} isNonEmpty :- When true, it will show a error message when text field loss focus and string is empty
 * params {boolea} hasMimimumLength :- validate if the text length enter is equal or mimimum length specified.
 * params {number} mimimumLength :- minimum no of character to validate when hasMinimumLength set to true
 */

export default class AppTextInput extends Component {
  constructor(props) {
    super(props);

    const { value = "" } = props;

    this.state = {
      text: value,
      error: "",
    };
  }

  // Capture the text input onBlur event, applies the validation and show error (if any),
  // if also pass the event to the parent compnent when onBlur props is provided.
  applyValidationOnBlur = () => {
    const {
      onBlur,
      isNonEmpty,
      hasMimimumLength,
      onValidationError,
      minimumLength,
    } = this.props;

    const { text } = this.state;

    // Passing the event to the parent
    onBlur?.();

    if (!IsNonEmptyString(text) && isNonEmpty) {
      onValidationError?.();

      this.setState({
        error: "Field cannot be empty",
      });

      return;
    }

    if (text?.trim().length < minimumLength && hasMimimumLength) {
      onValidationError?.();

      this.setState({
        error: `Mimimum ${minimumLength} character are required`,
      });

      return;
    }
  };

  onChangeText = (text) => {
    const { onChangeText } = this.props;

    this.setState({
      text,
      error: "",
    });

    // Passing the event to the parent
    onChangeText?.(text);
  };

  render() {
    const {
      style,
      isNonEmpty,
      onBlur,
      onChangeText,
      hideErrorLabel = false,
      ...rest
    } = this.props;
    const { text, error } = this.state;

    return (
      <>
        <TextInput
          autoFocus={false}
          placeholderTextColor="#555555"
          style={[Styles.containerStyle, style]}
          onBlur={this.applyValidationOnBlur}
          onChangeText={this.onChangeText}
          {...rest}
        />

        {/* Showing error in case of any */}
        {!hideErrorLabel && (
          <AppText type="errorLabel" style={{ marginLeft: 10, marginTop: 2 }}>
            {error}
          </AppText>
        )}
      </>
    );
  }
}
