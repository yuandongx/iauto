/**
 *
 *
 *
 */
import React from 'react';
import {Card} from 'antd';
import { hasPermission } from 'libs';


export default function AuthCard(props) {
  let disabled = props.disabled === undefined ? false : props.disabled;
  if (props.auth && !hasPermission(props.auth)) {
    disabled = true;
  }
  return disabled ? null : <Card {...props}>{props.children}</Card>
}
