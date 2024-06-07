import React, { useState } from "react";
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
  fontSizeBody1,
  fontWeightBold,
} from "../../styles/variables";
import styled from "@emotion/styled";
const CrudModal = ({
  firstButtonText,
  secondButtonText,
  modalHeadig,
  subText,
  firstButtonColor,
  secondButtonColor,
  children,
}: {
  firstButtonText: string;
  secondButtonText: string;
  modalHeadig: string;
  subText: string;
  firstButtonColor: string;
  secondButtonColor: string;
  children: React.ReactNode;
}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const handleDeleteTrue = () => {
    setDeleteModal(true);
  };
  const handleDeleteFalse = () => {
    setDeleteModal(false);
  };
  const DeleteModalContainer = styled.div`
    padding: ${borderRadius20};
    width: ${fullWidth};
  `;
  const Deletetext = styled.div`
    width: 244px;
    height: 23.238px;
    flex-shrink: 0;
    color: ${darkblueColor};
    font-family: ${fontFamily};
    font-size: ${fontSizeBody1};
    font-weight: ${fontWeightBold};
    line-height: normal;
  `;
  const Suretext = styled.div`
    color: ${blackColor};
    text-align: center;
    font-family: ${fontFamily};
    font-size: ${fontSizeBody1};
    font-weight: ${fontWeightBold};
    line-height: normal;
    padding: 2rem 0;
  `;
  const ButtonFlex = styled.div`
    display: flex;
    justify-content: space-between;
    gap: ${borderRadiusBig};
    align-item: center;
  `;
  const buttonStyles = `
width: 120px;
height: 42px;
flex-shrink: 0;
text-align: center;
font-family: ${fontFamily};
font-size: ${fontSizeBody2};
font-weight: ${fontWeightBold};
line-height: 150%;
cursor: ${buttonCursor};
align-items: center;
display: flex;
justify-content: center;
`;
  const CancelButton = styled.div`
    ${buttonStyles}
    border: 1px solid ${darkCharcoalColor};
    color: ${darkCharcoalColor};
    background-color: ${firstButtonColor};
  `;
  const DeleteButton = styled.div`
    ${buttonStyles}
    width: 210px;
    border: 5px solid ${secondButtonColor};
    background: ${secondButtonColor};
    color: ${whiteColor};
  `;
  return (
    <Modal
      open={deleteModal}
      width="1000px"
      closeModal={handleDeleteTrue}
      maxWidth="lg"
    >
      <DeleteModalContainer>
        <Deletetext>{modalHeadig}</Deletetext>
        {children}
        {subText.length > 0 && <Suretext>{subText}</Suretext>}

        <ButtonFlex>
          <CancelButton onClick={handleDeleteFalse}>
            {firstButtonText}
          </CancelButton>
          <DeleteButton onClick={handleDeleteFalse}>
            {secondButtonText}
          </DeleteButton>
        </ButtonFlex>
      </DeleteModalContainer>
    </Modal>
  );
};
export default CrudModal;
