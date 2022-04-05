import { useDispatch } from "react-redux";
import * as S from "@components/CreatePost/Post.styled";
import { addDescription } from "./descriptionSlice";

export default function InputDescription() {
  const dispatch = useDispatch();
  return (
    <S.InputForm
      fullWidth
      multiline
      spellCheck
      autoComplete="title"
      autoFocus={true}
      placeholder={"Type your description here"}
      onChange={e => dispatch(addDescription({ description: e.target.value }))}
    ></S.InputForm>
  );
}
