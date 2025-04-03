//
//   Copyright ou © ou Copr. Université de Lorraine, (2025)
//
//   Direction du Numérique de l'Université de Lorraine - SIED
//
//   Ce logiciel est un programme informatique servant à rendre accessible
//   sur mobile et sur internet l'application ULEP (University Language
//   Exchange Programme) aux étudiants et aux personnels des universités
//   parties prenantes.
//
//   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
//   et respectant les principes de diffusion des logiciels libres. Vous pouvez
//   utiliser, modifier et/ou redistribuer ce programme sous les conditions
//   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
//   sur le site "http://cecill.info".
//
//   En contrepartie de l'accessibilité au code source et des droits de copie,
//   de modification et de redistribution accordés par cette licence, il n'est
//   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
//   seule une responsabilité restreinte pèse sur l'auteur du programme, le
//   titulaire des droits patrimoniaux et les concédants successifs.
//
//   À cet égard, l'attention de l'utilisateur est attirée sur les risques
//   associés au chargement, à l'utilisation, à la modification et/ou au
//   développement et à la reproduction du logiciel par l'utilisateur étant
//   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
//   manipuler et qui le réserve donc à des développeurs et des professionnels
//   avertis possédant des connaissances informatiques approfondies. Les
//   utilisateurs sont donc invités à charger et à tester l'adéquation du
//   logiciel à leurs besoins dans des conditions permettant d'assurer la
//   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
//   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
//
//   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
//   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
//   termes.
//

import UIKit
import Capacitor

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.

        if #available(iOS 13.0, *) {
            if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
                let statusBarManager = windowScene.statusBarManager
                let statusBarHeight = statusBarManager?.statusBarFrame.height ?? 0

                let statusbarView = UIView()
                statusbarView.backgroundColor = UIColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0)
                window?.rootViewController?.view.addSubview(statusbarView)

                statusbarView.translatesAutoresizingMaskIntoConstraints = false
                statusbarView.heightAnchor.constraint(equalToConstant: statusBarHeight).isActive = true
                statusbarView.widthAnchor.constraint(equalTo: (window?.rootViewController?.view.widthAnchor)!).isActive = true
                statusbarView.topAnchor.constraint(equalTo: (window?.rootViewController?.view.topAnchor)!).isActive = true
                statusbarView.centerXAnchor.constraint(equalTo: (window?.rootViewController?.view.centerXAnchor)!).isActive = true
            }
        }

        return true
    }


    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }
    
    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
      NotificationCenter.default.post(name: .capacitorDidRegisterForRemoteNotifications, object: deviceToken)
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
      NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

}
