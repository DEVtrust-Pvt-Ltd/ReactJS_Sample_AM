import React, { useCallback } from "react";
import Modal from "../ui/modal/Modal";
import {
  whiteColor,
  darkCharcoalColor,
  buttonCursor,
  fontSizeBody2,
  borderRadiusBig,
  blackColor,
  darkblueColor,
  borderRadius20,
  fullWidth,
  fontFamily,
  gutters,
  fontWeightNormal,
  fontWeightXlBold,
} from "../../styles/variables";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { typographyParagraph } from "@/styles/typography";
const DealModal = ({
  firstButtonText,
  secondButtonText,
  modalHeadig,
  subText,
  firstButtonColor,
  secondButtonColor,
  open,
  close,
  resetForm,
  handleSubmit,
  children,
}: {
  firstButtonText: string;
  secondButtonText: string;
  modalHeadig: string;
  subText?: string;
  firstButtonColor: string;
  secondButtonColor: string;
  children: React.ReactNode;
  open: boolean;
  close: () => void;
  handleSubmit: () => void;
  resetForm?: () => void;
}) => {
  const onClose = useCallback(() => {
    close();
    if (resetForm) {
      resetForm();
    }
  }, [close, resetForm]);

  return (
    <Modal open={open} width="1000px" closeModal={onClose} maxWidth="lg">
      <DeleteModalContainer>
        <ContentWrapper>
          {" "}
          <Heading>{modalHeadig}</Heading>
          {children}
        </ContentWrapper>
        {subText && <Suretext>{subText}</Suretext>}
        <ButtonFlex>
          <CancelButton color={firstButtonColor} onClick={onClose}>
            {firstButtonText}
          </CancelButton>
          <DeleteButton color={secondButtonColor} onClick={handleSubmit}>
            {secondButtonText}
          </DeleteButton>
        </ButtonFlex>
      </DeleteModalContainer>
    </Modal>
  );
};
export default DealModal;

const DeleteModalContainer = styled.div`
  padding: ${borderRadius20};
  width: ${fullWidth};
`;
const Heading = styled.div(
  [typographyParagraph],
  css`
    color: ${darkblueColor};
  `,
);

const Suretext = styled.div(
  [typographyParagraph],
  css`
    color: ${blackColor};
    text-align: center;
    padding: ${gutters.large}px;
    padding-bottom: ${gutters.small * 2}px;
  `,
);

const ButtonFlex = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${borderRadiusBig};
  align-item: center;
`;
const buttonStyles = `
width: 120px;
height: 42px;
text-align: center;
font-family: ${fontFamily};
font-size: ${fontSizeBody2};
font-weight: ${fontWeightNormal};
line-height: 150%;
cursor: ${buttonCursor};
align-items: center;
display: flex;
justify-content: center;
`;
const CancelButton = styled.div<{
  color: string | number;
}>(
  ({ color }) => css`
    ${buttonStyles}
    border: 1px solid ${darkCharcoalColor};
    color: ${darkCharcoalColor};
    background-color: ${color};
  `,
);
const DeleteButton = styled.div<{
  color: string | number;
}>(
  ({ color }) => css`
    ${buttonStyles}
    width: 210px;
    border: 5px solid ${color};
    background: ${color};
    color: ${whiteColor};
    font-weight: ${fontWeightXlBold};
  `,
);
const ContentWrapper = styled.div`
  display: block;
  margin: auto;
  width: 275.371px;
}
`;
