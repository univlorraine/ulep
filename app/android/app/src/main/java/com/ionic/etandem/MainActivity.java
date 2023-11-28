package com.ionic.etandem;

import com.getcapacitor.Plugin;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import io.sentry.capacitor.SentryCapacitor;
import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(SentryCapacitor.class);
  }
}
