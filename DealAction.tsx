import { useQueryContext } from "@/context/query/queryContext";
import DeleteDeal from "@/layouts/deals/dealactions/DeleteDeal";
import LostDeal from "@/layouts/deals/dealactions/LostDeal";
import WonDeal from "@/layouts/deals/dealactions/WonDeal";
import { typographyH3 } from "@/styles/typography";
import {
  GreenTeal,
  greyColor,
  lightRedColor,
  whiteColor,
} from "@/styles/variables";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import React from "react";
import { Droppable } from "react-beautiful-dnd";

const StyledActionButtons = styled.button<{
  color: string;
  bgColor: boolean;
}>(
  ({ color, bgColor }) => css`
    ${typographyH3};
    max-width: 419.284px;
    width: 100%;
    height: 68.56px;
    border: 2px dashed ${color};
    background: ${!bgColor ? whiteColor : color};
    font-family: Montserrat;
    cursor: pointer;
    color: ${!bgColor ? color : whiteColor};
    display: flex;
    align-items: center;
    justify-content: center;
  `,
);
const Wrapper = styled.div`
  display: flex;
  height: 120px;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const DealAction = ({ isopen }: { isopen: boolean }) => {
  return (
    <>
      {actionbtn.map((item, index) => {
        return isopen ? (
          <Droppable droppableId={item.type} key={item.type}>
            {(provided, snapshot) => {
              return (
                <Wrapper
                  key={index}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <StyledActionButtons
                    color={item.color}
                    bgColor={snapshot.isDraggingOver}
                  >
                    {item.title}
                  </StyledActionButtons>
                </Wrapper>
              );
            }}
          </Droppable>
        ) : null;
      })}
    </>
  );
};

export default DealAction;

const actionbtn = [
  {
    title: "Delete",
    type: "delete",
    color: greyColor,
  },
  {
    title: "Lost",
    type: "lost",
    color: lightRedColor,
  },
  {
    title: "Won",
    type: "won",
    color: GreenTeal,
  },
];

export const ActionComponents = ({
  type,
  id = "",
}: {
  type: string;
  id?: string;
}) => {
  const { dealListData } = useQueryContext();
  const ProfileData = getUserData(dealListData, id);
  const actionComponents: any = {
    delete: <DeleteDeal id={id} profileData={ProfileData} />,
    won: <WonDeal id={id} profileData={ProfileData} />,
    lost: <LostDeal id={id} profileData={ProfileData} />,
  };

  return actionComponents[type] || null;
};

const getUserData = (
  data: { [s: string]: any } | ArrayLike<any>,
  id: string,
) => {
  const filteredItems = Object.values(data)
    .flatMap((list) => list.item)
    .filter((item) => item.id === id);
  return filteredItems[0];
};
