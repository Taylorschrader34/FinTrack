import React, { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Table, ButtonToolbar, IconButton } from "rsuite";
import TrashIcon from "@rsuite/icons/Trash";
import EditIcon from "@rsuite/icons/Edit";
import DeleteRefundModal from "./DeleteRefundModal";

const { Column, HeaderCell, Cell } = Table;

const RefundTable = ({ refunds, getTransaction }) => {
  const navigate = useNavigate();

  const [showDelRefundModal, setShowDelRefundModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);

  const handleEditRefund = (refund) => {
    navigate(`/Refunds/Edit/${refund.id}`);
  };

  const handleDeleteRefund = (refund) => {
    setSelectedRefund(refund);
    setShowDelRefundModal(true);
  };

  const handleModalClose = () => {
    setShowDelRefundModal(false);
    setSelectedRefund(null);
    getTransaction();
  };

  return (
    <>
      <Table
        data={refunds}
        height={200}
        rowHeight={50}
        headerHeight={50}
        autoHeight
        virtualized
        bordered
      >
        <Column width={100} fixed align="center" resizable sortable>
          <HeaderCell>Amount</HeaderCell>
          <Cell dataKey="amount" />
        </Column>
        <Column width={150} align="center" resizable sortable>
          <HeaderCell>Transaction Date</HeaderCell>
          <Cell dataKey="refundDate">
            {(rowData) => format(new Date(rowData.refundDate), "yyyy-MM-dd")}
          </Cell>
        </Column>
        <Column width={200} align="center" resizable sortable>
          <HeaderCell>Description</HeaderCell>
          <Cell dataKey="description" />
        </Column>
        <Column width={150} fixed="right" align="center" resizable>
          <HeaderCell>Edit/Delete</HeaderCell>
          <Cell>
            {(rowData) => (
              <ButtonToolbar>
                <IconButton
                  icon={<EditIcon />}
                  size="xs"
                  appearance="ghost"
                  color="blue"
                  onClick={() => handleEditRefund(rowData)}
                />
                <IconButton
                  icon={<TrashIcon />}
                  size="xs"
                  appearance="ghost"
                  color="red"
                  onClick={() => handleDeleteRefund(rowData)}
                />
              </ButtonToolbar>
            )}
          </Cell>
        </Column>
      </Table>
      <DeleteRefundModal
        showModal={showDelRefundModal}
        refund={selectedRefund}
        onClose={handleModalClose}
      />
    </>
  );
};

export default RefundTable;
