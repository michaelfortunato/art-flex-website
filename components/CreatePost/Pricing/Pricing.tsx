import { useState } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Typography
} from "@material-ui/core";
import { Add, BorderStyle } from "@material-ui/icons";
import { useTheme } from "@material-ui/styles";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux-store/store";
import * as BaseForm from "@components/Library/FormField/BaseFormField.styled";
import { DropdownSelection } from "@components/Dropdowns";

function ConfigPriceRow(props: { priceId: string; priceType: "Rent" | "Buy" }) {
  const [price, setPrice] = useState<number | null>(null);
  return (
    <TableRow component={motion.tr} layout>
      <TableCell align="left" component="th" scope="row">
        <Typography variant="body1">{props.priceType}</Typography>
      </TableCell>
      <TableCell align="left" component="th" scope="row">
        {props.priceType === "Rent" && <DropdownSelection />}
      </TableCell>
      <TableCell align="left" component="th" scope="row">
        <BaseForm.AFBaseFormField
          fullWidth={true}
          style={{ maxWidth: 150 }}
          placeholder="Set the Price"
          type="number"
          onChange={e => setPrice(parseInt(e.target.value, 10))}
        />
      </TableCell>
      <TableCell align="center" component="th" scope="row">
        <IconButton
          color="primary"
          disabled={typeof price !== "number" || price <= 0}
          onClick={() =>
            typeof price === "number" && props.setBuyPriceConfig(price)
          }
        >
          <Add />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

type ConfigurePriceTableProps = {
  rows: { priceId: string; priceType: "Rent" | "Buy" }[];
};
export function ConfigurePriceTable(props: ConfigurePriceTableProps) {
  return (
    <TableContainer component={motion.div} layout>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Buy or Rent</TableCell>
            <TableCell align="left">Period</TableCell>
            <TableCell align="left">Price</TableCell>
            <TableCell align="left">Confirm</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ priceId, priceType }) => (
            <ConfigPriceRow key={rowId} priceId={rowId} priceType="Rent" />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
